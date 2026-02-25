-- procedimiento almacenado y vista para el procedimiento almacenado login

CREATE OR ALTER PROCEDURE GenerarEntidadLoginTS
    @ViewName SYSNAME
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE 
        @ClassName NVARCHAR(100),
        @ListaName NVARCHAR(100),
        @Output NVARCHAR(MAX) = '',
        @Campos NVARCHAR(MAX) = '',
        @ConstructorParams NVARCHAR(MAX) = '',
        @ConstructorBody NVARCHAR(MAX) = '',
        @ViewExists BIT = 0;

    /* ===============================
       Validar existencia de la vista
    =============================== */
    SELECT @ViewExists = 1
    FROM INFORMATION_SCHEMA.VIEWS
    WHERE TABLE_NAME = @ViewName;

    IF @ViewExists = 0
    BEGIN
        PRINT '-- Error: La vista ' + @ViewName + ' no existe.';
        RETURN;
    END

    /* ===============================
       Nombres de clase
    =============================== */
    SET @ClassName = 'LoginIdentity';
    SET @ListaName = 'ListaLoginIdentity';

    /* ===============================
       Campos de la entidad
    =============================== */
    SELECT 
        @Campos = STRING_AGG(
            '  ' + LOWER(LEFT(COLUMN_NAME,1)) + SUBSTRING(COLUMN_NAME,2,100) + ': ' +
            CASE 
                WHEN DATA_TYPE LIKE '%char%' THEN 'string'
                WHEN DATA_TYPE = 'bit' THEN 'boolean'
                WHEN DATA_TYPE IN ('int','bigint','smallint') THEN 'number'
                ELSE 'any'
            END + ';'
        , CHAR(13)+CHAR(10))
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = @ViewName;

    /* ===============================
       Constructor params
    =============================== */
    SELECT 
        @ConstructorParams = STRING_AGG(
            LOWER(LEFT(COLUMN_NAME,1)) + SUBSTRING(COLUMN_NAME,2,100) + ': ' +
            CASE 
                WHEN DATA_TYPE LIKE '%char%' THEN 'string = ""'
                WHEN DATA_TYPE = 'bit' THEN 'boolean = false'
                WHEN DATA_TYPE IN ('int','bigint','smallint') THEN 'number = 0'
                ELSE 'any = null'
            END
        , ',' + CHAR(13)+CHAR(10))
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = @ViewName;

    /* ===============================
       Constructor body
    =============================== */
    SELECT 
        @ConstructorBody = STRING_AGG(
            '    this.' + LOWER(LEFT(COLUMN_NAME,1)) + SUBSTRING(COLUMN_NAME,2,100) +
            ' = ' + LOWER(LEFT(COLUMN_NAME,1)) + SUBSTRING(COLUMN_NAME,2,100) + ';'
        , CHAR(13)+CHAR(10))
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = @ViewName;

    /* ===============================
       Output final
    =============================== */
    SET @Output =
'export class ' + @ClassName + ' {
' + @Campos + '

  constructor(
' + @ConstructorParams + '
  ) {
' + @ConstructorBody + '
  }
}

export class ' + @ListaName + ' extends Array<' + @ClassName + '> {
  constructor(...items: ' + @ClassName + '[]) {
    super(...items);
    Object.setPrototypeOf(this, ' + @ListaName + '.prototype);
  }
}';

    PRINT @Output;
END;


EXEC GenerarEntidadLoginTS 'vw_LoginEntity';


CREATE OR ALTER VIEW vw_LoginEntity
AS
SELECT
    -- Usuario
    u.Id_Usuario,
    u.Usuario,
    u.status_registro AS UsuarioActivo,

    -- Perfil
    p.Id_Perfil,
    p.Nombre_perfil,
    p.status_registro AS PerfilActivo,

    -- Empresa
    e.Id_Empresa,
    e.Nombre_Comercial,
    e.status_registro AS EmpresaActivo,

    -- Sucursal
    s.id_sucursal,
    s.Nombre AS NombreSucursal,
    s.Codigo_Sucursal,
    s.status_registro AS SucursalActivo,

    -- Equipo
    eq.Id_equipo,
    eq.nombre AS NombreEquipo,
    eq.status_del_registro AS EquipoActivo

FROM Usuarios u
INNER JOIN Perfiles p
    ON u.id_perfil = p.Id_Perfil
INNER JOIN Empresas e
    ON p.id_empresa = e.Id_Empresa
INNER JOIN Sucursales s
    ON s.id_empresa = e.Id_Empresa
INNER JOIN EQUIPOS_POR_SUCURSAL eq
    ON eq.id_sucurusal = s.id_sucursal;
