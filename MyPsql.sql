-- Tabla de usuarios
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE "product" (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(255),
    calificacion DECIMAL(3,2) DEFAULT 0,
    vendidos INTEGER DEFAULT 0,
    categoria VARCHAR(100),
    ubicacion VARCHAR(255),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    vendedor_id INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de calificaciones (ratings)
CREATE TABLE "rating" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES "product"(id) ON DELETE CASCADE,
    puntuacion INTEGER CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id) -- un usuario no puede calificar el mismo producto dos veces
);

-- Tabla de favoritos
CREATE TABLE "favorito" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES "product"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id) -- no puede marcar el mismo producto dos veces
);

-- Índices útiles
CREATE INDEX idx_product_categoria ON "product"(categoria);
CREATE INDEX idx_product_ubicacion ON "product"(ubicacion);
CREATE INDEX idx_favorito_user ON "favorito"(user_id);
CREATE INDEX idx_rating_user ON "rating"(user_id);


