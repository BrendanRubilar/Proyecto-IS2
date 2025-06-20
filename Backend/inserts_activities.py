from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Actividad,ActividadLaboral

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
    Actividad(nombre="Caminata en el parque", temperatura_min=15.5, temperatura_max=28.0, estado_dia="Clear",humedad_max = 77, viento_max = 50.4, descripcion="Disfruta una caminata relajante en un parque cercano."),
    Actividad(nombre="Ciclismo de montaña", temperatura_min=10.0, temperatura_max=22.0, estado_dia="Clear",humedad_max = 89, viento_max = 50.6, descripcion="Recorre senderos en la montaña disfrutando de la naturaleza."),
    Actividad(nombre="Nadar en la piscina", temperatura_min=18.0, temperatura_max=30.0, estado_dia="Clear",humedad_max = 78, viento_max = 50.6, descripcion="Refrescate en una piscina al aire libre."),
    Actividad(nombre="Día de picnic", temperatura_min=20.0, temperatura_max=25.0, estado_dia="Clear",humedad_max = 69, viento_max = 50.8, descripcion="Disfruta de un día al aire libre con amigos o familia."),
    Actividad(nombre="Senderismo", temperatura_min=12.0, temperatura_max=24.0, estado_dia="Clear",humedad_max = 72, viento_max = 50.1, descripcion="Recorre senderos en la naturaleza."),
    Actividad(nombre="Correr en el parque", temperatura_min=14.0, temperatura_max=26.0, estado_dia="Clear",humedad_max = 73, viento_max = 50.9, descripcion="Corre por los caminos del parque para mantenerte en forma."),
    Actividad(nombre="Fotografía en el campo", temperatura_min=16.0, temperatura_max=28.0, estado_dia="Clear",humedad_max = 74, viento_max = 500.5, descripcion="Captura la belleza del paisaje en un día despejado."),
    Actividad(nombre="Golf", temperatura_min=18.0, temperatura_max=30.0, estado_dia="Clear",humedad_max = 90, viento_max = 50.5, descripcion="Disfruta de una partida de golf bajo un cielo despejado."),
    Actividad(nombre="Paseo en bote", temperatura_min=22.0, temperatura_max=32.0, estado_dia="Clear",humedad_max = 68, viento_max = 50.1, descripcion="Relájate navegando en un bote por el lago."),
    Actividad(nombre="Escalada en roca", temperatura_min=18.0, temperatura_max=30.0, estado_dia="Clear",humedad_max = 80, viento_max = 50.5, descripcion="Escala rocas en un entorno natural mientras disfrutas de la vista."),

    #Rain
    Actividad(nombre="Leer un libro bajo techo", temperatura_min=18.0, temperatura_max=22.0, estado_dia="Rain",humedad_max = 100, viento_max = 78.5, descripcion="Relájate leyendo un buen libro mientras la lluvia cae suavemente fuera."),
    Actividad(nombre="Ver una película en casa", temperatura_min=16.0, temperatura_max=20.0, estado_dia="Rain",humedad_max = 100, viento_max = 78.7, descripcion="Aprovecha el día lluvioso para disfrutar de una película o serie en casa."),
    Actividad(nombre="Cocinar recetas nuevas", temperatura_min=14.0, temperatura_max=20.0, estado_dia="Rain",humedad_max = 100, viento_max = 78.7, descripcion="Experimenta en la cocina preparando platos nuevos y deliciosos."),
    Actividad(nombre="Hacer yoga en casa", temperatura_min=18.0, temperatura_max=22.0, estado_dia="Rain",humedad_max = 100, viento_max = 78.7, descripcion="Disfruta de una clase de yoga para relajarte y estirarte en un día lluvioso."),
    Actividad(nombre="Pintura o manualidades", temperatura_min=16.0, temperatura_max=21.0, estado_dia="Rain",humedad_max = 100, viento_max = 78.5, descripcion="Dedica el tiempo lluvioso a las artes plásticas y crea algo bonito."),
    Actividad(nombre="Escuchar música y relajarse", temperatura_min=17.0, temperatura_max=21.0, estado_dia="Rain",humedad_max = 100, viento_max = 78.1, descripcion="Disfruta de música suave y relájate mientras llueve fuera."),
    Actividad(nombre="Jugar a juegos de mesa", temperatura_min=18.0, temperatura_max=22.0, estado_dia="Rain",humedad_max = 100, viento_max = 78.6, descripcion="Una excelente oportunidad para compartir con familia o amigos."),
    Actividad(nombre="Meditar", temperatura_min=18.0, temperatura_max=22.0, estado_dia="Rain",humedad_max = 100, viento_max = 78.8, descripcion="Aprovecha el ambiente tranquilo que la lluvia proporciona para meditar."),
    Actividad(nombre="Planificar tus próximas vacaciones", temperatura_min=16.0, temperatura_max=19.0, estado_dia="Rain",humedad_max = 100, viento_max = 78.5, descripcion="Investiga y organiza tu próximo destino de vacaciones."),
    Actividad(nombre="Hacer tareas de limpieza en casa", temperatura_min=15.0, temperatura_max=20.0, estado_dia="Rain",humedad_max = 100, viento_max = 78.6, descripcion="Es el momento ideal para ordenar y limpiar el hogar, sin distracciones del clima exterior."),
    
    #Snow
    Actividad(nombre="Esquí o snowboard", temperatura_min=-5.0, temperatura_max=0.0, estado_dia="Snow",humedad_max = 90, viento_max = 77.8, descripcion="Disfruta de un día de esquí o snowboard en la nieve."),
    Actividad(nombre="Construir un muñeco de nieve", temperatura_min=-2.0, temperatura_max=1.0, estado_dia="Snow",humedad_max = 90, viento_max = 78.1, descripcion="Aprovecha la nieve para construir tu propio muñeco de nieve en el jardín."),
    Actividad(nombre="Patinaje sobre hielo", temperatura_min=-3.0, temperatura_max=-1.0, estado_dia="Snow",humedad_max = 90, viento_max = 70.7, descripcion="Practica patinaje sobre hielo en una pista local."),
    Actividad(nombre="Senderismo en la nieve", temperatura_min=-4.0, temperatura_max=-1.0, estado_dia="Snow",humedad_max = 90, viento_max = 78.7, descripcion="Disfruta de una caminata por un sendero cubierto de nieve."),
    Actividad(nombre="Tomar chocolate caliente", temperatura_min=-1.0, temperatura_max=2.0, estado_dia="Snow",humedad_max = 90, viento_max = 77.8, descripcion="Relájate en casa con una taza de chocolate caliente mientras ves la nieve caer."),
    Actividad(nombre="Leer junto a la chimenea", temperatura_min=-2.0, temperatura_max=2.0, estado_dia="Snow",humedad_max = 90, viento_max = 78.4, descripcion="Disfruta de un buen libro junto al calor de una chimenea."),
    Actividad(nombre="Fotografía de paisajes nevados", temperatura_min=-3.0, temperatura_max=-1.0, estado_dia="Snow",humedad_max = 90, viento_max = 76.9, descripcion="Captura la belleza de los paisajes cubiertos de nieve."),
    Actividad(nombre="Sledging (andar en trineo)", temperatura_min=-4.0, temperatura_max=-1.0, estado_dia="Snow",humedad_max = 90, viento_max = 78.9, descripcion="Disfruta de la nieve deslizándote en un trineo."),
    Actividad(nombre="Hacer un ángel en la nieve", temperatura_min=-3.0, temperatura_max=0.0, estado_dia="Snow",humedad_max = 90, viento_max = 79.5, descripcion="Recuerda la diversión de hacer ángeles en la nieve cuando eras niño."),
    Actividad(nombre="Ver películas navideñas", temperatura_min=-5.0, temperatura_max=0.0, estado_dia="Snow",humedad_max = 90, viento_max = 76.5, descripcion="Relájate viendo películas navideñas mientras disfrutas de la vista de la nieve desde el interior.")

]
actividades2 = [
    # Mist
    Actividad(nombre="Caminata en el bosque", temperatura_min=5.0, temperatura_max=12.0, estado_dia="Mist",humedad_max = 80, viento_max = 88.9, descripcion="Disfruta de una caminata tranquila en el bosque envuelto por la niebla."),
    Actividad(nombre="Paseo en barco en el río", temperatura_min=8.0, temperatura_max=15.0, estado_dia="Mist",humedad_max = 80, viento_max = 89.8, descripcion="Navega por el río mientras te rodea una niebla misteriosa."),
    Actividad(nombre="Visita a un mirador", temperatura_min=6.0, temperatura_max=12.0, estado_dia="Mist",humedad_max = 80, viento_max = 85.9, descripcion="Sube a un mirador y observa el paisaje cubierto por la niebla."),
    Actividad(nombre="Sesión de fotografía en la niebla", temperatura_min=5.0, temperatura_max=14.0, estado_dia="Mist",humedad_max = 80, viento_max = 81.7, descripcion="Captura imágenes en un entorno de niebla, creando una atmósfera única."),
    Actividad(nombre="Ciclismo en la niebla", temperatura_min=8.0, temperatura_max=16.0, estado_dia="Mist",humedad_max = 80, viento_max = 88.5, descripcion="Haz ciclismo por caminos tranquilos mientras la niebla cubre el paisaje."),
    Actividad(nombre="Trekking en la montaña", temperatura_min=7.0, temperatura_max=15.0, estado_dia="Mist",humedad_max = 80, viento_max = 88.9, descripcion="Realiza una caminata por la montaña mientras la niebla te rodea, dándole un toque misterioso a la aventura."),
    Actividad(nombre="Observación de aves", temperatura_min=6.0, temperatura_max=14.0, estado_dia="Mist",humedad_max = 80, viento_max = 86.1, descripcion="Escucha los sonidos de la naturaleza mientras la niebla cubre el paisaje, creando un ambiente perfecto para la observación de aves."),
    Actividad(nombre="Escalada en roca", temperatura_min=9.0, temperatura_max=18.0, estado_dia="Mist",humedad_max = 80, viento_max = 85.4, descripcion="Escala rocas cubiertas por la niebla, creando una experiencia desafiante y misteriosa."),
    Actividad(nombre="Paseo por el jardín botánico", temperatura_min=7.0, temperatura_max=13.0, estado_dia="Mist",humedad_max = 80, viento_max = 80.9, descripcion="Disfruta de la tranquilidad del jardín botánico, rodeado de plantas cubiertas por una suave capa de niebla."),
    Actividad(nombre="Café en la terraza con niebla", temperatura_min=10.0, temperatura_max=18.0, estado_dia="Mist",humedad_max = 80, viento_max = 89.7, descripcion="Relájate en una terraza mientras disfrutas de un café y observas cómo la niebla cubre el paisaje."),
    #Clouds
    Actividad(nombre="Café en una terraza", temperatura_min=12.0, temperatura_max=18.0, estado_dia="Clouds",humedad_max = 70, viento_max = 70.5, descripcion="Disfruta de una bebida caliente en una terraza mientras observas el cielo nublado."),
    Actividad(nombre="Visitar un museo", temperatura_min=14.0, temperatura_max=20.0, estado_dia="Clouds",humedad_max = 70, viento_max = 71.3, descripcion="Perfecto para explorar arte o historia en un ambiente acogedor."),
    Actividad(nombre="Leer en un café", temperatura_min=13.0, temperatura_max=19.0, estado_dia="Clouds",humedad_max = 70, viento_max = 74.4, descripcion="Pasa una tarde tranquila leyendo un buen libro en tu café favorito."),
    Actividad(nombre="Películas en casa", temperatura_min=16.0, temperatura_max=22.0, estado_dia="Clouds",humedad_max = 70, viento_max = 70.5, descripcion="Relájate viendo una película en la comodidad de tu hogar."),
    Actividad(nombre="Día de spa", temperatura_min=18.0, temperatura_max=24.0, estado_dia="Clouds",humedad_max = 70, viento_max = 72.5, descripcion="Mímate con un masaje o tratamientos de relajación en un spa."),
    Actividad(nombre="Cultura en un centro de arte", temperatura_min=15.0, temperatura_max=21.0, estado_dia="Clouds",humedad_max = 70, viento_max = 79.8, descripcion="Visita una galería de arte o una exposición cultural bajo un cielo gris."),
    Actividad(nombre="Tarde de juegos de mesa", temperatura_min=14.0, temperatura_max=20.0, estado_dia="Clouds",humedad_max = 70, viento_max = 73.8, descripcion="Disfruta de una tarde divertida jugando con amigos o familia."),
    Actividad(nombre="Cocina en casa", temperatura_min=17.0, temperatura_max=23.0, estado_dia="Clouds",humedad_max = 70, viento_max = 89.8, descripcion="Prepara una receta especial en la comodidad de tu hogar."),
    Actividad(nombre="Té en una librería", temperatura_min=15.0, temperatura_max=21.0, estado_dia="Clouds",humedad_max = 70, viento_max = 90.8, descripcion="Relájate tomando un té mientras exploras los libros de una librería acogedora."),
    Actividad(nombre="Visitar un centro comercial", temperatura_min=18.0, temperatura_max=24.0, estado_dia="Clouds",humedad_max = 70, viento_max = 90.8, descripcion="Haz compras o simplemente pasea por el centro comercial en un día nublado."),
]

actividades100x100 = [
    Actividad(nombre="Observa las aves", temperatura_min=-10.0, temperatura_max=50.0, estado_dia="Clear",humedad_max = 100, viento_max = 100.5, descripcion="El cielo esta despejado, observa las aves."),
    Actividad(nombre="Observa la lluvia caer", temperatura_min=-10.0, temperatura_max=50.0, estado_dia="Rain",humedad_max = 100, viento_max = 100.5, descripcion="Hay lluvia, quedate en casa a observarla."),
    Actividad(nombre="Paseo por la ciudad", temperatura_min=-10.0, temperatura_max=50.0, estado_dia="Mist",humedad_max = 100, viento_max = 100.5, descripcion="Da un paseo por la ciudad, pero ten cuidado, hay niebla."),
    Actividad(nombre="Cocina en la casa", temperatura_min=-10.0, temperatura_max=50.0, estado_dia="Clouds",humedad_max = 100, viento_max = 100.5, descripcion="El cielo no esta bonito, quedate en casa a cocinar algo."),
    Actividad(nombre="Comer galletas y bebida caliente", temperatura_min=-10.0, temperatura_max=50.0, estado_dia="Snow",humedad_max = 100, viento_max = 100.5, descripcion="Come unas ricas galletas y toma algo calido para acompañar el frio."),
]
actividades_laborales = [
    ActividadLaboral(nombre="Jornada en oficina",temperatura_min=10.0,temperatura_max=30.0,estado_dia="Clear",humedad_max = 100, viento_max = 100.5,descripcion="Trabajo regular en las instalaciones de la empresa."),
    ActividadLaboral(nombre="Teletrabajo",temperatura_min=5.0,temperatura_max=25.0,estado_dia="Rain",humedad_max = 100, viento_max = 100.5,descripcion="Trabajo desde casa usando herramientas digitales."),
    ActividadLaboral(nombre="Actividades de team building en exteriores",temperatura_min=15.0,temperatura_max=28.0,estado_dia="Clear",humedad_max = 100, viento_max = 100.5,descripcion="Dinámicas de grupo al aire libre para fomentar el trabajo en equipo."),
]



# Inserta las actividades en la base de datos
for actividad in actividades:
    db.add(actividad)

for actividad in actividades2:
    db.add(actividad)

for actividad in actividades100x100:
    db.add(actividad)
# Actividades laborales (nueva tabla)
for actividad in actividades_laborales:
    db.add(actividad)
# Confirma la transacción
db.commit()

# Cierra la sesión
db.close()

print("Actividades insertadas exitosamente.")
