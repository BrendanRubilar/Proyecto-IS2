from sqlalchemy.orm import Session
from database import SessionLocal
from models import Favorito

# Crear sesión de base de datos
db: Session = SessionLocal()

# Crear la relación favorito
nuevo_favorito = Favorito(user_id=1, actividad_id=5)

# Insertar en la base de datos
db.add(nuevo_favorito)
db.commit()

print("¡Favorito insertado correctamente!")
