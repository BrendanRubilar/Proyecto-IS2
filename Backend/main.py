# main.py

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud 
from database import SessionLocal, engine 
import requests
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta, date, timezone 
from passlib.context import CryptContext
import math 
from urllib.parse import quote as encodeURIComponent
import locale as pylocale # Para formatear nombres de días
from typing import Optional, List, Dict, Any
# Cargar variables de entorno (API_KEY, SECRET_KEY, etc.)
load_dotenv()
API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise EnvironmentError("FATAL: No se encontró API_KEY en el archivo .env. La aplicación no puede iniciarse.")

SECRET_KEY = os.getenv("SECRET_KEY", "una_clave_secreta_por_defecto_muy_larga_y_dificil_de_adivinar_cambiame_en_produccion")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 120))


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Crear las tablas en la base de datos si no existen
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Clima y Actividades",
    description="Provee datos del clima y sugerencias de actividades basadas en el clima.",
    version="1.0.1" # Incrementada la versión
)

# Configuración CORS para permitir solicitudes desde el frontend
origins = [
    "http://localhost:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Permite todos los métodos (GET, POST, etc.)
    #allow_headers=["*"], # Permite todos los encabezados
    allow_headers=["*", "Authorization"],
)


# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Funciones auxiliares para el procesamiento de datos del clima ---
def mps_to_kmh(mps: Optional[float]) -> Optional[float]:
    if mps is None:
        return None
    return round(mps * 3.6, 1)

def calculate_dew_point(temp_c: Optional[float], humidity_percent: Optional[float]) -> Optional[float]:
    if temp_c is None or humidity_percent is None or humidity_percent <= 0: # Evitar log(0) o negativo
        return None
    try:
        # Fórmula aproximada de Magnus-Tetens
        a = 17.27
        b = 237.7
        alpha = ((a * temp_c) / (b + temp_c)) + math.log(humidity_percent / 100.0)
        dew_point = (b * alpha) / (a - alpha)
        return round(dew_point, 1)
    except (ValueError, TypeError, ZeroDivisionError) as e:
        print(f"Error calculando punto de rocío: temp={temp_c}, hum={humidity_percent}, error={e}")
        return None

def get_air_quality_data(lat: float, lon: float, api_key: str) -> Dict[str, Any]:
    aq_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={api_key}"
    try:
        response = requests.get(aq_url)
        response.raise_for_status()
        aq_data = response.json()
        if aq_data and aq_data.get("list") and len(aq_data["list"]) > 0:
            components = aq_data["list"][0]["components"]
            # Usamos pm2_5 como valor principal si está, si no, un valor por defecto.
            return {"value": round(components.get("pm2_5", 0), 1) if components else "N/A"}
    except requests.exceptions.RequestException as e:
        print(f"Error obteniendo calidad del aire: {e}")
    except (KeyError, IndexError, TypeError) as e: # TypeError por si components es None
        print(f"Error parseando datos de calidad del aire: {e}")
    return {"value": "N/A"}


# --- Endpoints ---

@app.post("/items/", response_model=schemas.Item, tags=["Items (Ejemplo)"])
def create_item_endpoint(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db=db, item=item)

@app.get("/items/", response_model=list[schemas.Item], tags=["Items (Ejemplo)"])
def read_items_endpoint(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_items(db=db, skip=skip, limit=limit)

@app.post("/actividades/", response_model=schemas.Actividad, tags=["Actividades"])
def create_actividad_endpoint(actividad: schemas.ActividadCreate, db: Session = Depends(get_db)):
    return crud.create_actividad(db=db, actividad=actividad)

@app.get("/actividades/", response_model=list[schemas.Actividad], tags=["Actividades"])
def read_actividades_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_actividades(db=db, skip=skip, limit=limit)

@app.get("/actividades/filtrar", response_model=list[schemas.Actividad], tags=["Actividades"])
def filtrar_actividades_endpoint(
    estado: str,
    temp: float,
    hum: int,
    viento: float,
    db: Session = Depends(get_db)
):
    estado = estado.capitalize()
    return crud.filtrar_actividades(db=db, estado=estado, temp=temp, hum=hum, viento=viento)












@app.get("/preferencias/", response_model=List[schemas.Preferencias], tags=["Preferencias"])
def read_preferencias(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception

    return crud.get_preferencias(db=db, usr=user)


from fastapi import APIRouter, Depends, HTTPException
from typing import List

@app.post("/preferencias/", response_model=List[schemas.Preferencias], tags=["Preferencias"])
def crear_preferencias(
    pref_list: List[schemas.PreferenciasCreate],  # <--- Aquí el cambio
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    # Validar token y usuario
    credentials_exception = HTTPException(
        status_code=401,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception

    nuevas_prefs = crud.create_preferencias(db=db, pref_list=pref_list, usr=user)

    return nuevas_prefs





@app.get("/clima/por-coordenadas", response_model=schemas.FullWeatherReport, tags=["Clima"])
def obtener_pronostico_por_coordenadas(lat: float, lon: float):
    # Endpoint de OpenWeatherMap para pronóstico por coordenadas
    forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric&lang=es"
    
    try:
        response = requests.get(forecast_url)
        response.raise_for_status() # Lanza HTTPError para códigos 4xx/5xx
        datos_forecast = response.json()
    except requests.exceptions.HTTPError as http_err:
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Coordenadas {lat},{lon} no encontradas por el proveedor de clima.")
        elif response.status_code == 401: # Unauthorized
            raise HTTPException(status_code=500, detail="Error de configuración del servidor: API Key de clima inválida.")
        else:
            raise HTTPException(status_code=response.status_code, detail=f"Error del proveedor de clima: {http_err}")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"No se pudo contactar al proveedor de clima: {e}")
    
    if not datos_forecast or "list" not in datos_forecast or not datos_forecast["list"]:
        raise HTTPException(status_code=404, detail=f"No se encontraron datos de pronóstico para las coordenadas {lat},{lon}.")

    # Información de la ciudad y zona horaria
    city_info = datos_forecast["city"]
    city_timezone_offset_seconds = city_info["timezone"]

    # Obtener calidad del aire
    air_quality = get_air_quality_data(lat, lon, API_KEY)

    # Procesar datos "actuales"
    current_raw = datos_forecast["list"][0]
    current_processed = schemas.CurrentWeather(
        dt=current_raw["dt"],
        temperatura=round(current_raw["main"]["temp"]),
        sensacion_termica=round(current_raw["main"]["feels_like"]),
        presion=current_raw["main"]["pressure"],
        humedad=current_raw["main"]["humidity"],
        visibilidad=current_raw.get("visibility", 10000),
        punto_rocio=calculate_dew_point(current_raw["main"]["temp"], current_raw["main"]["humidity"]),
        viento_velocidad=mps_to_kmh(current_raw["wind"]["speed"]),
        descripcion=current_raw["weather"][0]["description"],
        icono=current_raw["weather"][0]["icon"],
        main=current_raw["weather"][0]["main"],
        calidad_aire=air_quality
    )

    # Procesar datos horarios
    hourly_processed = [
        schemas.HourlyForecastItem(
            dt=item["dt"],
            temp=round(item["main"]["temp"]),
            icono=item["weather"][0]["icon"],
            pop=round(item.get("pop", 0) * 100)
        ) for item in datos_forecast["list"]
    ]

    # Agrupar datos por día local (mismo código que antes)
    daily_aggregation = {}
    for item in datos_forecast["list"]:
        item_datetime_utc = datetime.fromtimestamp(item["dt"], tz=timezone.utc)
        item_datetime_local = item_datetime_utc + timedelta(seconds=city_timezone_offset_seconds)
        item_date_local_str = item_datetime_local.date().isoformat()

        if item_date_local_str not in daily_aggregation:
            start_of_local_day_naive = datetime.combine(item_datetime_local.date(), datetime.min.time())
            start_of_local_day_utc = start_of_local_day_naive - timedelta(seconds=city_timezone_offset_seconds)
            daily_aggregation[item_date_local_str] = {
                "dt_utc_start_day": int(start_of_local_day_utc.timestamp()),
                "temps_min": [], "temps_max": [], "feels_like_temps": [],
                "icons_weighted": {}, "descriptions_weighted": {}, "mains_weighted": {},
                "pops": [], "humidities": [], "pressures": [], "wind_speeds": []
            }
        
        agg = daily_aggregation[item_date_local_str]
        agg["temps_min"].append(item["main"]["temp_min"])
        agg["temps_max"].append(item["main"]["temp_max"])
        agg["feels_like_temps"].append(item["main"]["feels_like"])
        
        icon = item["weather"][0]["icon"]
        agg["icons_weighted"][icon] = agg["icons_weighted"].get(icon, 0) + 1
        desc = item["weather"][0]["description"]
        agg["descriptions_weighted"][desc] = agg["descriptions_weighted"].get(desc, 0) + 1
        main_w = item["weather"][0]["main"]
        agg["mains_weighted"][main_w] = agg["mains_weighted"].get(main_w, 0) + 1

        agg["pops"].append(item.get("pop", 0) * 100)
        agg["humidities"].append(item["main"]["humidity"])
        agg["pressures"].append(item["main"]["pressure"])
        agg["wind_speeds"].append(mps_to_kmh(item["wind"]["speed"]))

    # Construir pronóstico diario (mismo código que antes)
    daily_final_list = []
    now_utc = datetime.now(timezone.utc)
    city_today_local = (now_utc + timedelta(seconds=city_timezone_offset_seconds)).date()

    original_locale = pylocale.getlocale(pylocale.LC_TIME)
    try:
        pylocale.setlocale(pylocale.LC_TIME, "es_ES.UTF-8")
    except pylocale.Error:
        try:
            pylocale.setlocale(pylocale.LC_TIME, "Spanish_Spain.1252")
        except pylocale.Error:
            pass

    for day_iso_str, data in sorted(daily_aggregation.items())[:7]:
        day_date_local = date.fromisoformat(day_iso_str)
        
        day_label = ""
        if day_date_local == city_today_local:
            day_label = "Today"
        elif (day_date_local - city_today_local).days == 1:
            day_label = "Tomorrow"
        else:
            day_label = day_date_local.strftime("%A").capitalize().replace(".","")

        daily_final_list.append(schemas.DailyForecastItem(
            dt=data["dt_utc_start_day"],
            dayLabel=day_label,
            temp_min=round(min(data["temps_min"])),
            temp_max=round(max(data["temps_max"])),
            sensacion_termica_dia=round(sum(data["feels_like_temps"]) / len(data["feels_like_temps"])),
            icono=max(data["icons_weighted"], key=data["icons_weighted"].get),
            descripcion=max(data["descriptions_weighted"], key=data["descriptions_weighted"].get),
            main=max(data["mains_weighted"], key=data["mains_weighted"].get),
            pop=round(max(data["pops"])),
            humedad=round(sum(data["humidities"]) / len(data["humidities"])),
            presion=round(sum(data["pressures"]) / len(data["pressures"])),
            viento_velocidad=round(sum(data["wind_speeds"]) / len(data["wind_speeds"]), 1),
            calidad_aire=None
        ))
    
    pylocale.setlocale(pylocale.LC_TIME, original_locale)

    return schemas.FullWeatherReport(
        ciudad=city_info["name"],  # Nombre de la ciudad devuelto por OpenWeatherMap
        lat=lat,  # Usamos las coordenadas que recibimos como parámetro
        lon=lon,
        timezone_offset=city_timezone_offset_seconds,
        current=current_processed,
        hourly=hourly_processed,
        daily=daily_final_list
    )


# --- Autenticación ---


def authenticate_user(db: Session, email: str, password: str) -> Optional[models.User]:
    user = crud.get_user_by_email(db, email)
    if not user or not pwd_context.verify(password, user.hashed_password):
        return None
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@app.post("/register/", response_model=schemas.User, tags=["Autenticación"])
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    print(user)  # Agrega esto para inspeccionar los datos recibidos
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="El correo electrónico ya está registrado")
    try:
        return crud.create_user(db=db, user=user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/token", response_model=schemas.Token, tags=["Autenticación"])
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password) 
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Correo electrónico o contraseña incorrectos", 
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires 
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=schemas.User, tags=["Usuarios"])
async def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401, 
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: Optional[str] = payload.get("sub") 
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_email(db, email=email) 
    if user is None:
        raise credentials_exception
    return user

@app.get("/actividades/recomendadas", response_model=List[schemas.Actividad], tags=["Actividades"])
def get_actividades_recomendadas(
    temperatura: float,
    estado: str,
    hum: int,
    viento: float,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    estado = estado.capitalize()
    # --- Autenticación ---
    credentials_exception = HTTPException(
        status_code=401,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub") 
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = crud.get_user_by_email(db, email=email) # Changed to use email
    if user is None:
        raise credentials_exception

    preferencias = db.query(models.UserPreference).filter_by(user_id=user.id).all()
    if not preferencias:
        raise HTTPException(status_code=404, detail="El usuario no tiene preferencias registradas")
    
    
    # print(f"Preferencias del usuario {user.username} (id={user.id}):")
    # for p in preferencias:
    #     print(f" - activity_type_id={p.activity_type_id}, modality_id={p.modality_id}")

    activity_type_ids = [p.activity_type_id for p in preferencias]
    modality_ids = [p.modality_id for p in preferencias]


    print(f"Filtrando actividades con:")
    print(f" - temperatura={temperatura}")
    print(f" - estado_dia={estado}")
    print(f" - activity_type_ids={activity_type_ids}")
    print(f" - modality_ids={modality_ids}")

    actividades_filtradas = crud.get_actividades_por_clima_y_preferencias(
        db=db,
        temperatura=temperatura,
        estado=estado,
        hum=hum, 
        viento=viento,
        activity_type_ids=activity_type_ids,
        modality_ids=modality_ids
    )
    return actividades_filtradas

# Para ejecutar con `python main.py
if __name__ == "__main__":
    import uvicorn
    print(f"Iniciando servidor Uvicorn en http://localhost:8000")
    print(f"API Key de clima cargada: {'Sí' if API_KEY else 'No (¡CONFIGURAR .env!)'}")
    print(f"Documentación de la API disponible en http://localhost:8000/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) # reload=True para desarroll