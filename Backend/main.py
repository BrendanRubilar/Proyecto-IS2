from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine
import requests
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os


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
    temp_min: float,
    temp_max: float,
    db: Session = Depends(get_db)
):
    return crud.filtrar_actividades(db=db, estado=estado, temp_min=temp_min, temp_max=temp_max)

#La idea es esta:
#Consigues con la api del tiempo estos datos "estado", "temp_min", "temp_max"
#y en el front tendras que hacer una llamada asi:
#`http://localhost:8000/actividades/filtrar?estado=${estado}&temp_min=${tempMin}&temp_max=${tempMax}`
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
    }
