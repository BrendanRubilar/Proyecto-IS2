from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Actividad

# Establece la conexión con la base de datos
DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Crea una sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Crea las tablas si no existen
Base.metadata.create_all(bind=engine)

# Inserta las actividades
actividades = [
    #Clear
    Actividad(nombre="Caminata en el parque", temperatura_min=15.5, temperatura_max=28.0, estado_dia="Clear", descripcion="Disfruta una caminata relajante en un parque cercano."),
    Actividad(nombre="Ciclismo de montaña", temperatura_min=10.0, temperatura_max=22.0, estado_dia="Clear", descripcion="Recorre senderos en la montaña disfrutando de la naturaleza."),
    Actividad(nombre="Nadar en la piscina", temperatura_min=18.0, temperatura_max=30.0, estado_dia="Clear", descripcion="Refrescate en una piscina al aire libre."),
    Actividad(nombre="Día de picnic", temperatura_min=20.0, temperatura_max=25.0, estado_dia="Clear", descripcion="Disfruta de un día al aire libre con amigos o familia."),
    Actividad(nombre="Senderismo", temperatura_min=12.0, temperatura_max=24.0, estado_dia="Clear", descripcion="Recorre senderos en la naturaleza."),
    Actividad(nombre="Correr en el parque", temperatura_min=14.0, temperatura_max=26.0, estado_dia="Clear", descripcion="Corre por los caminos del parque para mantenerte en forma."),
    Actividad(nombre="Fotografía en el campo", temperatura_min=16.0, temperatura_max=28.0, estado_dia="Clear", descripcion="Captura la belleza del paisaje en un día despejado."),
    Actividad(nombre="Golf", temperatura_min=18.0, temperatura_max=30.0, estado_dia="Clear", descripcion="Disfruta de una partida de golf bajo un cielo despejado."),
    Actividad(nombre="Paseo en bote", temperatura_min=22.0, temperatura_max=32.0, estado_dia="Clear", descripcion="Relájate navegando en un bote por el lago."),
    Actividad(nombre="Escalada en roca", temperatura_min=18.0, temperatura_max=30.0, estado_dia="Clear", descripcion="Escala rocas en un entorno natural mientras disfrutas de la vista."),

    #Rain
    Actividad(nombre="Leer un libro bajo techo", temperatura_min=18.0, temperatura_max=22.0, estado_dia="Rain", descripcion="Relájate leyendo un buen libro mientras la lluvia cae suavemente fuera."),
    Actividad(nombre="Ver una película en casa", temperatura_min=16.0, temperatura_max=20.0, estado_dia="Rain", descripcion="Aprovecha el día lluvioso para disfrutar de una película o serie en casa."),
    Actividad(nombre="Cocinar recetas nuevas", temperatura_min=14.0, temperatura_max=20.0, estado_dia="Rain", descripcion="Experimenta en la cocina preparando platos nuevos y deliciosos."),
    Actividad(nombre="Hacer yoga en casa", temperatura_min=18.0, temperatura_max=22.0, estado_dia="Rain", descripcion="Disfruta de una clase de yoga para relajarte y estirarte en un día lluvioso."),
    Actividad(nombre="Pintura o manualidades", temperatura_min=16.0, temperatura_max=21.0, estado_dia="Rain", descripcion="Dedica el tiempo lluvioso a las artes plásticas y crea algo bonito."),
    Actividad(nombre="Escuchar música y relajarse", temperatura_min=17.0, temperatura_max=21.0, estado_dia="Rain", descripcion="Disfruta de música suave y relájate mientras llueve fuera."),
    Actividad(nombre="Jugar a juegos de mesa", temperatura_min=18.0, temperatura_max=22.0, estado_dia="Rain", descripcion="Una excelente oportunidad para compartir con familia o amigos."),
    Actividad(nombre="Meditar", temperatura_min=18.0, temperatura_max=22.0, estado_dia="Rain", descripcion="Aprovecha el ambiente tranquilo que la lluvia proporciona para meditar."),
    Actividad(nombre="Planificar tus próximas vacaciones", temperatura_min=16.0, temperatura_max=19.0, estado_dia="Rain", descripcion="Investiga y organiza tu próximo destino de vacaciones."),
    Actividad(nombre="Hacer tareas de limpieza en casa", temperatura_min=15.0, temperatura_max=20.0, estado_dia="Rain", descripcion="Es el momento ideal para ordenar y limpiar el hogar, sin distracciones del clima exterior."),
    
    #Snow
    Actividad(nombre="Esquí o snowboard", temperatura_min=-5.0, temperatura_max=0.0, estado_dia="Snow", descripcion="Disfruta de un día de esquí o snowboard en la nieve."),
    Actividad(nombre="Construir un muñeco de nieve", temperatura_min=-2.0, temperatura_max=1.0, estado_dia="Snow", descripcion="Aprovecha la nieve para construir tu propio muñeco de nieve en el jardín."),
    Actividad(nombre="Patinaje sobre hielo", temperatura_min=-3.0, temperatura_max=-1.0, estado_dia="Snow", descripcion="Practica patinaje sobre hielo en una pista local."),
    Actividad(nombre="Senderismo en la nieve", temperatura_min=-4.0, temperatura_max=-1.0, estado_dia="Snow", descripcion="Disfruta de una caminata por un sendero cubierto de nieve."),
    Actividad(nombre="Tomar chocolate caliente", temperatura_min=-1.0, temperatura_max=2.0, estado_dia="Snow", descripcion="Relájate en casa con una taza de chocolate caliente mientras ves la nieve caer."),
    Actividad(nombre="Leer junto a la chimenea", temperatura_min=-2.0, temperatura_max=2.0, estado_dia="Snow", descripcion="Disfruta de un buen libro junto al calor de una chimenea."),
    Actividad(nombre="Fotografía de paisajes nevados", temperatura_min=-3.0, temperatura_max=-1.0, estado_dia="Snow", descripcion="Captura la belleza de los paisajes cubiertos de nieve."),
    Actividad(nombre="Sledging (andar en trineo)", temperatura_min=-4.0, temperatura_max=-1.0, estado_dia="Snow", descripcion="Disfruta de la nieve deslizándote en un trineo."),
    Actividad(nombre="Hacer un ángel en la nieve", temperatura_min=-3.0, temperatura_max=0.0, estado_dia="Snow", descripcion="Recuerda la diversión de hacer ángeles en la nieve cuando eras niño."),
    Actividad(nombre="Ver películas navideñas", temperatura_min=-5.0, temperatura_max=0.0, estado_dia="Snow", descripcion="Relájate viendo películas navideñas mientras disfrutas de la vista de la nieve desde el interior.")

]
actividades2 = [
    # Mist
    Actividad(nombre="Caminata en el bosque", temperatura_min=5.0, temperatura_max=12.0, estado_dia="Mist", descripcion="Disfruta de una caminata tranquila en el bosque envuelto por la niebla."),
    Actividad(nombre="Paseo en barco en el río", temperatura_min=8.0, temperatura_max=15.0, estado_dia="Mist", descripcion="Navega por el río mientras te rodea una niebla misteriosa."),
    Actividad(nombre="Visita a un mirador", temperatura_min=6.0, temperatura_max=12.0, estado_dia="Mist", descripcion="Sube a un mirador y observa el paisaje cubierto por la niebla."),
    Actividad(nombre="Sesión de fotografía en la niebla", temperatura_min=5.0, temperatura_max=14.0, estado_dia="Mist", descripcion="Captura imágenes en un entorno de niebla, creando una atmósfera única."),
    Actividad(nombre="Ciclismo en la niebla", temperatura_min=8.0, temperatura_max=16.0, estado_dia="Mist", descripcion="Haz ciclismo por caminos tranquilos mientras la niebla cubre el paisaje."),
    Actividad(nombre="Trekking en la montaña", temperatura_min=7.0, temperatura_max=15.0, estado_dia="Mist", descripcion="Realiza una caminata por la montaña mientras la niebla te rodea, dándole un toque misterioso a la aventura."),
    Actividad(nombre="Observación de aves", temperatura_min=6.0, temperatura_max=14.0, estado_dia="Mist", descripcion="Escucha los sonidos de la naturaleza mientras la niebla cubre el paisaje, creando un ambiente perfecto para la observación de aves."),
    Actividad(nombre="Escalada en roca", temperatura_min=9.0, temperatura_max=18.0, estado_dia="Mist", descripcion="Escala rocas cubiertas por la niebla, creando una experiencia desafiante y misteriosa."),
    Actividad(nombre="Paseo por el jardín botánico", temperatura_min=7.0, temperatura_max=13.0, estado_dia="Mist", descripcion="Disfruta de la tranquilidad del jardín botánico, rodeado de plantas cubiertas por una suave capa de niebla."),
    Actividad(nombre="Café en la terraza con niebla", temperatura_min=10.0, temperatura_max=18.0, estado_dia="Mist", descripcion="Relájate en una terraza mientras disfrutas de un café y observas cómo la niebla cubre el paisaje."),
    #Clouds
    Actividad(nombre="Café en una terraza", temperatura_min=12.0, temperatura_max=18.0, estado_dia="Clouds", descripcion="Disfruta de una bebida caliente en una terraza mientras observas el cielo nublado."),
    Actividad(nombre="Visitar un museo", temperatura_min=14.0, temperatura_max=20.0, estado_dia="Clouds", descripcion="Perfecto para explorar arte o historia en un ambiente acogedor."),
    Actividad(nombre="Leer en un café", temperatura_min=13.0, temperatura_max=19.0, estado_dia="Clouds", descripcion="Pasa una tarde tranquila leyendo un buen libro en tu café favorito."),
    Actividad(nombre="Películas en casa", temperatura_min=16.0, temperatura_max=22.0, estado_dia="Clouds", descripcion="Relájate viendo una película en la comodidad de tu hogar."),
    Actividad(nombre="Día de spa", temperatura_min=18.0, temperatura_max=24.0, estado_dia="Clouds", descripcion="Mímate con un masaje o tratamientos de relajación en un spa."),
    Actividad(nombre="Cultura en un centro de arte", temperatura_min=15.0, temperatura_max=21.0, estado_dia="Clouds", descripcion="Visita una galería de arte o una exposición cultural bajo un cielo gris."),
    Actividad(nombre="Tarde de juegos de mesa", temperatura_min=14.0, temperatura_max=20.0, estado_dia="Clouds", descripcion="Disfruta de una tarde divertida jugando con amigos o familia."),
    Actividad(nombre="Cocina en casa", temperatura_min=17.0, temperatura_max=23.0, estado_dia="Clouds", descripcion="Prepara una receta especial en la comodidad de tu hogar."),
    Actividad(nombre="Té en una librería", temperatura_min=15.0, temperatura_max=21.0, estado_dia="Clouds", descripcion="Relájate tomando un té mientras exploras los libros de una librería acogedora."),
    Actividad(nombre="Visitar un centro comercial", temperatura_min=18.0, temperatura_max=24.0, estado_dia="Clouds", descripcion="Haz compras o simplemente pasea por el centro comercial en un día nublado."),
]
# Inserta las actividades en la base de datos
for actividad in actividades2:
    db.add(actividad)

# Confirma la transacción
db.commit()

# Cierra la sesión
db.close()

print("Actividades insertadas exitosamente.")
