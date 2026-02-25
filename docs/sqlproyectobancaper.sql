CREATE TABLE Usuarios(
    Id_Usuario VARCHAR(36) PRIMARY KEY,
    Usuario VARCHAR(100) NOT NULL,
    Nombre VARCHAR(150) NOT NULL,
    Correo_Electronico VARCHAR(100) UNIQUE,
    Contraseña VARCHAR(255) NOT NULL,
    status_registro BIT DEFAULT 1, -- BIT en SQL Server en lugar de BOOL
    fecha_creacion DATETIME DEFAULT GETDATE()
);


CREATE TABLE Perfiles(
    Id_Perfil VARCHAR(36) PRIMARY KEY,
    Nombre_perfil VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(200),
    status_registro BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE()
);


CREATE TABLE Sucursales(
    Id_Sucursal VARCHAR(36) PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Codigo_Sucursal VARCHAR(100) UNIQUE,
    Calle_Numero VARCHAR(150),
    Colonia VARCHAR(100),
    Municipio_Estado VARCHAR(150),
    Telefono VARCHAR(20),
    Id_Region VARCHAR(36),
    status_registro BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE()
);