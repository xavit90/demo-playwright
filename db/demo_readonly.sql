/* ============================================================
   Usuario SQL de SOLO LECTURA para la demo de Claude + MCP
   ------------------------------------------------------------
   Crea un login acotado a AdventureWorks2025 con permisos
   únicamente de lectura (db_datareader). Aunque la herramienta
   MCP tenga habilitado execute_query, el motor RECHAZA cualquier
   INSERT/UPDATE/DELETE/DDL porque este login no tiene permisos
   de escritura. Defensa en dos capas.

   USO:
     1. Cambia 'CAMBIA_ESTA_CONTRASENA' por una contraseña fuerte.
     2. Ejecuta con Windows auth (eres sysadmin):
          sqlcmd -S localhost -E -C -i db\demo_readonly.sql
     3. Usa esa MISMA contraseña en la variable de entorno
        MSSQL_CONNECTIONSTRING (ver README-claude-mcp.md).
   ============================================================ */

USE [master];
GO

IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'demo_readonly')
BEGIN
    CREATE LOGIN [demo_readonly]
        WITH PASSWORD = N'CAMBIA_ESTA_CONTRASENA',
             CHECK_POLICY = OFF,
             DEFAULT_DATABASE = [AdventureWorks2025];
END
GO

USE [AdventureWorks2025];
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'demo_readonly')
BEGIN
    CREATE USER [demo_readonly] FOR LOGIN [demo_readonly];
END
GO

-- Solo lectura sobre AdventureWorks2025
ALTER ROLE [db_datareader] ADD MEMBER [demo_readonly];
GO

-- Denegar explícitamente escritura (cinturón y tirantes)
ALTER ROLE [db_datawriter] DROP MEMBER [demo_readonly];
GO

PRINT 'Listo: login demo_readonly creado/actualizado como SOLO LECTURA en AdventureWorks2025.';
GO
