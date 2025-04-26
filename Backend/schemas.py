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