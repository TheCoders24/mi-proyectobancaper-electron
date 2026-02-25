/* =========================
   TABLA: Empresas
========================= */
CREATE TABLE Empresas (
    Id_Empresa VARCHAR(36) PRIMARY KEY,
    Razon_social VARCHAR(200),
    Nombre_Comercial VARCHAR(150),
    RFC VARCHAR(30),
    Direccion VARCHAR(150),
    Telefono_Contacto VARCHAR(20),
    status_registro BIT
);

/* =========================
   TABLA: Regiones
========================= */
CREATE TABLE Regiones (
    Id_Region VARCHAR(36) PRIMARY KEY,
    Nombre_Region VARCHAR(100),
    Descripcion VARCHAR(150),
    status_registro BIT
);


/* =========================
   TABLA: Sucursales
========================= */
CREATE TABLE Sucursales (
    id_sucursal VARCHAR(36) PRIMARY KEY,
    Nombre VARCHAR(150),
    Codigo_Sucursal VARCHAR(100),
    Calle_Numero VARCHAR(150),
    Colonia VARCHAR(100),
    Municipio_Estado VARCHAR(150),
    Telefono VARCHAR(20),
    Id_Region VARCHAR(36),
    id_empresa VARCHAR(36),
    status_registro BIT,

    CONSTRAINT fk_sucursal_region
        FOREIGN KEY (Id_Region)
        REFERENCES Regiones(Id_Region),

    CONSTRAINT fk_sucursal_empresa
        FOREIGN KEY (id_empresa)
        REFERENCES Empresas(Id_Empresa)
);

/* =========================
   TABLA: Equipos por Sucursal
========================= */
CREATE TABLE EQUIPOS_POR_SUCURSAL (
    Id_equipo VARCHAR(36) PRIMARY KEY,
    id_sucurusal VARCHAR(36),
    nombre VARCHAR(150),
    status_del_registro BIT,

    CONSTRAINT fk_equipo_sucursal
        FOREIGN KEY (id_sucurusal)
        REFERENCES Sucursales(id_sucursal)
);


/* =========================
   TABLA: Perfiles
========================= */
CREATE TABLE Perfiles (
    Id_Perfil VARCHAR(36) PRIMARY KEY,
    Nombre_perfil VARCHAR(100),
    Descripcion VARCHAR(200),
    Contraseña VARCHAR(225),
    id_empresa VARCHAR(36),
    status_registro BIT,

    CONSTRAINT fk_perfil_empresa
        FOREIGN KEY (id_empresa)
        REFERENCES Empresas(Id_Empresa)
);


/* =========================
   TABLA: Usuarios
========================= */
CREATE TABLE Usuarios (
    Id_Usuario VARCHAR(36) PRIMARY KEY,
    Usuario VARCHAR(100),
    id_persona VARCHAR(36),
    Contraseña VARCHAR(255),
    id_perfil VARCHAR(36),
    status_registro BIT,

    CONSTRAINT fk_usuario_perfil
        FOREIGN KEY (id_perfil)
        REFERENCES Perfiles(Id_Perfil)
);