from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)


class Actividad(Base):
    __tablename__ = "actividades"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    temperatura_min = Column(Float)
    temperatura_max = Column(Float)
    estado_dia = Column(String)  # Por ejemplo: "rain", "snow", "cloud"
    descripcion = Column(String)

# La clase User representa a los usuarios en la base de datos
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True) 
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    preferences = relationship("UserPreference", back_populates="user")

class ActivityType(Base):
    __tablename__ = "activity_types"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)

class Modality(Base):
    __tablename__ = "modalities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)


class UserPreference(Base):
    __tablename__ = "user_preferences"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    activity_type_id = Column(Integer, ForeignKey("activity_types.id"), primary_key=True)
    modality_id = Column(Integer, ForeignKey("modalities.id"), primary_key=True)

    user = relationship("User", back_populates="preferences")
    activity_type = relationship("ActivityType")
    modality = relationship("Modality")

#Tablita para preferencias actividades
class ActivityPreference(Base):
    __tablename__ = "activity_preferences"

    actividad_id = Column(Integer, ForeignKey("actividades.id"), primary_key=True)
    activity_type_id = Column(Integer, ForeignKey("activity_types.id"), primary_key=True)
    modality_id = Column(Integer, ForeignKey("modalities.id"), primary_key=True)

    actividad = relationship("Actividad", backref="preferences")
    activity_type = relationship("ActivityType")
    modality = relationship("Modality")
