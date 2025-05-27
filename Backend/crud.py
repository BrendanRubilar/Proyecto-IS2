from sqlalchemy.orm import Session
import models, schemas
from models import Actividad, User
from schemas import ActividadCreate, UserCreate
from passlib.context import CryptContext
from typing import List


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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


# FILTRADO DE ACTIVIDADES con los datos de la API, instrucciones para DB (Esto le servirá a Juan).
def filtrar_actividades(db: Session, estado: str, temp: float):
    return (
        db.query(Actividad)
        .filter(
            Actividad.estado_dia == estado,
            Actividad.temperatura_min <= temp,
            Actividad.temperatura_max >= temp,
        )
        .all()
    )


def get_actividades_por_clima_y_preferencias(
    db: Session,
    temperatura: float,
    estado: str,
    activity_type_ids: List[int],
    modality_ids: List[int]
) -> List[models.Actividad]:
    return (
        db.query(models.Actividad)
        .join(models.ActivityPreference, models.Actividad.id == models.ActivityPreference.actividad_id)
        .filter(
            models.ActivityPreference.activity_type_id.in_(activity_type_ids),
            models.ActivityPreference.modality_id.in_(modality_ids),
            models.Actividad.temperatura_min <= temperatura,
            models.Actividad.temperatura_max >= temperatura,
            models.Actividad.estado_dia == estado
        )
        .all()
    )

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

