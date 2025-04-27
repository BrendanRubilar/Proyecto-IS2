from pydantic import BaseModel

class ItemBase(BaseModel):
    name: str
    description: str

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int

    class Config:
        from_attributes = True


class ActividadBase(BaseModel):
    nombre: str
    temperatura_min: int
    temperatura_max: int
    estado_dia: str
    descripcion: str

class ActividadCreate(ActividadBase):
    pass

class Actividad(ActividadBase):
    id: int

    class Config:
        orm_mode = True

class Api_Call:
    API_KEY = 'ec37d531cdd81de00e582d289c890b0e'
    CIUDAD = 'Concepción'
    URL = 'https://api.openweathermap.org/data/2.5/weather?q=' + CIUDAD + '&appid=' + API_KEY + '&units=metric&lang=es'

    ciudad: str
    temp: int
    descripcion: str
    viento: float
    humedad: float
    presion: float
    temp_max: int
    temp_min: int