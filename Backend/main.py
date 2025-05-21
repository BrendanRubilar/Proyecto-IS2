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
from datetime import datetime, timedelta
from passlib.context import CryptContext


load_dotenv()  
API_KEY = os.getenv("API_KEY")
CIUDAD = 'Concepcion'
# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Esto es por que el backend bloquea peticiones desde el frontend,en pocas palabras le da permiso al front para usar sus recursos
origins = [
    "http://localhost:5173",  # Frontend (Vite)
]

# middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Permite esos orígenes
    allow_credentials=True,
    allow_methods=["*"],              # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],              # Permite todos los headers
)


# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




# End points en esta sección
@app.post("/items/", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db=db, item=item)

@app.get("/items/", response_model=list[schemas.Item])
def read_items(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_items(db=db, skip=skip, limit=limit)

@app.post("/actividades/", response_model=schemas.Actividad)
def create_actividad(actividad: schemas.ActividadCreate, db: Session = Depends(get_db)):
    return crud.create_actividad(db=db, actividad=actividad)

@app.get("/actividades/", response_model=list[schemas.Actividad])
def read_actividades(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_actividades(db=db, skip=skip, limit=limit)

#FILTRADO DE ACTIVIDADES con los datos de la API, Endpoint (Esto le servirá a Juan).
@app.get("/actividades/filtrar", response_model=list[schemas.Actividad])
def filtrar_actividades(
    estado: str,
    temp: float,
    db: Session = Depends(get_db)
):
    return crud.filtrar_actividades(db=db, estado=estado, temp=temp)

#La idea es esta:
#Consigues con la api del tiempo estos datos "estado", "temp"
#y en el front tendras que hacer una llamada asi:
#`http://localhost:8000/actividades/filtrar?estado=${estado}&temp=$[temp]'
# Como dato en la respuesta de la api del clima, el estado corresponde a "main" por ejemplo "Rain"

#Ojo que entrega una lista con todas las actividades que cumplen con el filtro. Puedes limitar en el front la cantidad
#a mostrar, o si quieres cambias el endpoint y le dices das un valor para que busque esa cantidad como maximo.
@app.get("/clima/{ciudad}")
def obtener_clima(ciudad: str):
    url = f"https://api.openweathermap.org/data/2.5/weather?q={ciudad}&appid={API_KEY}&units=metric&lang=es"
    response = requests.get(url)
    
    if response.status_code != 200:
        return {"error": "No se pudo obtener el clima"}
    
    datos = response.json()
    return {
        "viento": datos["wind"]["speed"],
        "temperatura": datos["main"]["temp"],
        "descripcion": datos["weather"][0]["description"],
        "humedad": datos["main"]["humidity"],
        "presion": datos["main"]["pressure"],
        "icono": datos["weather"][0]["icon"],
        "temperatura_min": datos["main"]["temp_min"],
        "temperatura_max": datos["main"]["temp_max"],
        "main":            datos["weather"][0]["main"],
        "ciudad":          datos["name"]
    }

SECRET_KEY = "your_secret_key"  # Replace with a secure key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def authenticate_user(db: Session, username: str, password: str):
    user = crud.get_user_by_username(db, username)
    if not user or not pwd_context.verify(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/register/", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}
