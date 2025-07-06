from models import Favorito  # Asegúrate de que tu modelo Favorito exista
from database import SessionLocal

db = SessionLocal()

favorito1 = Favorito(usuario_id=2, actividad_id=4)
favorito2 = Favorito(usuario_id=2, actividad_id=6)

db.add_all([favorito1, favorito2])
db.commit()
db.close()
