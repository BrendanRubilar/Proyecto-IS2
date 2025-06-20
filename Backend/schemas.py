from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any


# --- Schemas existentes ---
class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    class Config:
        from_attributes = True # Reemplazo de orm_mode para Pydantic V2

class ActividadBase(BaseModel):
    nombre: str
    temperatura_min: float
    temperatura_max: float
    humedad_max: int
    viento_max: float
    estado_dia: str
    descripcion: str

class ActividadCreate(ActividadBase):
    pass

class Actividad(ActividadBase):
    id: int
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr

from pydantic import BaseModel, Field

class Preferencias(BaseModel):
    user_id: int
    tipo: int = Field(..., alias="activity_type_id")
    modalidad: int = Field(..., alias="modality_id")

    class Config:
        from_attributes = True
        populate_by_name = True


    class Config:
        from_attributes = True
        populate_by_name = True


class PreferenciasCreate(BaseModel):
    tipo: int = Field(..., alias="activity_type_id")
    modalidad: int = Field(..., alias="modality_id")

    class Config:
        populate_by_name = True
        from_attributes = True

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    
# Esto es el modelo de las actividades de los usuarios, todo eso deberia pedirse en el frontend :)
class UserActivityBase(BaseModel):
    nombre: str
    temperatura_min: float
    temperatura_max: float
    estado_dia: str
    descripcion: str
    consejos: str
    
class UserActivityCreate(UserActivityBase):
    pass

class UserActivity(UserActivityBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
        
# --- Nuevos Schemas para el pronóstico completo ---
class AirQuality(BaseModel):
    value: Any # Puede ser número o "N/A"

class CurrentWeather(BaseModel):
    dt: int
    temperatura: float
    sensacion_termica: float
    presion: int
    humedad: int
    visibilidad: int
    punto_rocio: Optional[float] = None
    viento_velocidad: float
    descripcion: str
    icono: str
    main: str
    calidad_aire: AirQuality

class HourlyForecastItem(BaseModel):
    dt: int
    temp: float
    icono: str
    pop: float # Probabilidad de precipitación

class DailyForecastItem(BaseModel):
    dt: int
    dayLabel: str
    temp_min: float
    temp_max: float
    sensacion_termica_dia: Optional[float] = None # Añadido
    icono: str
    descripcion: str
    main: str
    pop: float
    humedad: float
    presion: float
    viento_velocidad: float
    calidad_aire: Optional[AirQuality] = None # Calidad del aire para el día puede ser N/A

class FullWeatherReport(BaseModel):
    ciudad: str
    lat: float
    lon: float
    timezone_offset: int
    current: CurrentWeather
    hourly: List[HourlyForecastItem]
    daily: List[DailyForecastItem]

