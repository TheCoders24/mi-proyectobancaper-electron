-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[Auth_Login_Completo]
(
    @Paso INT,

    -- Equipo
    @NombreEquipo VARCHAR(150) = NULL,

    -- Selección
    @IdEmpresa VARCHAR(36) = NULL,
    @IdSucursal VARCHAR(36) = NULL,

    -- Login
    @Usuario VARCHAR(100) = NULL,
    @PasswordHash VARCHAR(255) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    /* =====================================================
       PASO 1 → VALIDAR EQUIPO + CARGAR EMPRESAS
       ===================================================== */
    IF @Paso = 1
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM EQUIPOS_POR_SUCURSAL
            WHERE nombre = @NombreEquipo
              AND status_del_registro = 1
        )
        BEGIN
            RAISERROR('Equipo no válido o inactivo', 16, 1);
            RETURN;
        END

        SELECT DISTINCT
            e.Id_Empresa,
            e.Nombre_Comercial
        FROM EQUIPOS_POR_SUCURSAL eq
        INNER JOIN Sucursales s ON eq.id_sucurusal = s.id_sucursal
        INNER JOIN Empresas e ON s.id_empresa = e.Id_Empresa
        WHERE eq.nombre = @NombreEquipo
          AND e.status_registro = 1
          AND s.status_registro = 1;

        RETURN;
    END

    /* =====================================================
       PASO 2 → CARGAR SUCURSALES POR EMPRESA
       ===================================================== */
    IF @Paso = 2
    BEGIN
        IF @IdEmpresa IS NULL
        BEGIN
            RAISERROR('IdEmpresa requerido', 16, 1);
            RETURN;
        END

        SELECT DISTINCT
            s.id_sucursal,
            s.Nombre,
            s.Codigo_Sucursal
        FROM EQUIPOS_POR_SUCURSAL eq
        INNER JOIN Sucursales s ON eq.id_sucurusal = s.id_sucursal
        WHERE s.id_empresa = @IdEmpresa
          AND eq.status_del_registro = 1
          AND s.status_registro = 1;

        RETURN;
    END

    
/* =====================================================
   PASO 3 → LOGIN FINAL (Login por Nombre_perfil)
===================================================== */
IF @Paso = 3
BEGIN
    -- Validar que el perfil y contraseña estén presentes
    IF @Usuario IS NULL OR @PasswordHash IS NULL
    BEGIN
        RAISERROR('Perfil y contraseña requeridos', 16, 1);
        RETURN;
    END

    -- Validar que el perfil exista y esté activo
    IF NOT EXISTS (
        SELECT 1
        FROM Usuarios u
        INNER JOIN Perfiles p ON u.id_perfil = p.Id_Perfil
        WHERE p.Nombre_perfil = @Usuario   -- 🔹 Ahora usamos el perfil
          AND u.Contraseña = @PasswordHash
          AND u.status_registro = 1
          AND p.status_registro = 1
    )
    BEGIN
        RAISERROR('Perfil o contraseña inválidos', 16, 1);
        RETURN;
    END

    -- Validar que el perfil esté autorizado para la empresa
    IF NOT EXISTS (
        SELECT 1
        FROM Usuarios u
        INNER JOIN Perfiles p ON u.id_perfil = p.Id_Perfil
        WHERE p.Nombre_perfil = @Usuario
          AND p.id_empresa = @IdEmpresa
          AND p.status_registro = 1
    )
    BEGIN
        RAISERROR('Perfil no autorizado para esta empresa', 16, 1);
        RETURN;
    END

    -- Validar que el equipo esté autorizado para la sucursal
    IF NOT EXISTS (
        SELECT 1
        FROM EQUIPOS_POR_SUCURSAL
        WHERE nombre = @NombreEquipo
          AND id_sucurusal = @IdSucursal
          AND status_del_registro = 1
    )
    BEGIN
        RAISERROR('Equipo no autorizado para la sucursal', 16, 1);
        RETURN;
    END

    -- LOGIN IDENTITY
    SELECT
        u.Id_Usuario AS idUsuario,
        p.Nombre_perfil AS usuario,        -- 🔹 Alias que se mostrará en frontend
        p.Id_Perfil AS idPerfil,
        p.Nombre_perfil AS nombrePerfil,
        e.Id_Empresa AS idEmpresa,
        e.Nombre_Comercial AS nombreEmpresa,
        s.id_sucursal AS idSucursal,
        s.Nombre AS nombreSucursal,
        eq.Id_equipo AS idEquipo,
        eq.nombre AS nombreEquipo
    FROM Usuarios u
    INNER JOIN Perfiles p ON u.id_perfil = p.Id_Perfil
    INNER JOIN Empresas e ON p.id_empresa = e.Id_Empresa
    INNER JOIN Sucursales s ON s.id_empresa = e.Id_Empresa
    INNER JOIN EQUIPOS_POR_SUCURSAL eq ON eq.id_sucurusal = s.id_sucursal
    WHERE p.Nombre_perfil = @Usuario
      AND u.Contraseña = @PasswordHash
      AND s.id_sucursal = @IdSucursal
      AND eq.nombre = @NombreEquipo;

    RETURN;
END
END
