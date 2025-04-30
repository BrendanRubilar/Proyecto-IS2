from sqlalchemy.orm import Session
import models, schemas
from models import Actividad
from schemas import ActividadCreate


def get_items(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Item).offset(skip).limit(limit).all()

def create_item(db: Session, item: schemas.ItemCreate):
    db_item = models.Item(name=item.name, description=item.description)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def create_actividad(db: Session, actividad: ActividadCreate):
    db_actividad = Actividad(**actividad.dict())
    db.add(db_actividad)
    db.commit()
    db.refresh(db_actividad)
    return db_actividad

def get_actividades(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Actividad).offset(skip).limit(limit).all()

#FILTRADO DE ACTIVIDADES con los datos de la API, instrucciones para DB (Esto le servirá a Juan).
def filtrar_actividades(db: Session, estado: str, temp: float):
    return (
        db.query(Actividad)
        .filter(
            Actividad.estado_dia == estado,
            Actividad.temperatura_min <= temp,
            Actividad.temperatura_max >= temp
        )
        .all()
    )
    
