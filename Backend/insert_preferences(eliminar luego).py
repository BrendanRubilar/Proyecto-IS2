#El usuario es de prueba, las inserciones de prueba tambien. Despues hay que eliminarlo.

#TESTEO PUSH

import sys
import os

from sqlalchemy.orm import Session

# Añadir el directorio padre al path para que funcione la importación
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models import User, ActivityType, Modality, UserPreference
from database import SessionLocal

# Abre la sesión
db: Session = SessionLocal()

# Obtén el usuario con id=3
user = db.query(User).filter(User.id == 2).first()

# Verifica que exista
if user:
    # Obtén las preferencias que quieres asignarle
    tipo_deportiva = db.query(ActivityType).filter_by(name="Deportiva").first()
    tipo_casa = db.query(ActivityType).filter_by(name="Casa").first()
    modalidad_individual = db.query(Modality).filter_by(name="Individual").first()
    modalidad_grupal = db.query(Modality).filter_by(name="Grupal").first()

    # Crea las preferencias
    pref1 = UserPreference(user_id=user.id, activity_type_id=tipo_deportiva.id, modality_id=modalidad_individual.id)
    pref2 = UserPreference(user_id=user.id, activity_type_id=tipo_casa.id, modality_id=modalidad_grupal.id)

    # Agrega y guarda
    db.add_all([pref1, pref2])
    db.commit()
    print("Preferencias agregadas correctamente.")
else:
    print("Usuario no encontrado.")

# Cierra sesión
db.close()
