# Prompt para un compañero: conectar Claude a varias bases SQL Server (patrón .env)

**Requisitos previos** (que tenga el compañero antes de pegar el prompt):
- SQL Server accesible (local o remoto) con las bases que quiera consultar.
- **.NET 10 SDK** instalado (`dotnet --version` >= 10).
- Estar dentro de la carpeta del repo al abrir Claude Code.

Copia el bloque de abajo y pégalo en Claude Code:

---

Quiero conectar Claude Code a **3 bases de datos SQL Server** para hacer
descubrimiento, diccionarios de datos, diagramas ER y consultas, en modo
**solo lectura** y **sin poner contraseñas en el repositorio**. Usa un patrón basado
en un archivo `.env` (que NO se sube a git) + un lanzador que lo carga, porque Claude
Code no lee `.env` por sí solo. Haz lo siguiente y verifica cada paso:

1. Confirma que tengo `dotnet` (>= 10). Instala el servidor MCP de SQL Server como
   herramienta global de .NET si falta:
   `dotnet tool install --global Ave.McpServer.MsSqlClient`
   y obtén la ruta absoluta del ejecutable
   (`~/.dotnet/tools/ave-mcpserver-mssqlclient(.exe)`).

2. Asegúrate de que `.env`, `.env.local` y `.env.*.local` estén en `.gitignore`
   (agrégalos si faltan).

3. Crea `db/.env.example` (plantilla versionada) con una variable por base siguiendo
   el patrón `MSSQL_CONNSTR_<ALIAS>`, por ejemplo:
   `MSSQL_CONNSTR_BD1=Server=localhost;Database=NombreBD1;User Id=usuario;Password=***;TrustServerCertificate=True;Encrypt=True;`
   Incluye 3 entradas de ejemplo con alias claros. NO crees `db/.env` con datos reales;
   eso lo hago yo.

4. Crea/actualiza `.mcp.json` en la raíz del repo con un bloque por base llamado
   `mssql-<alias>`, cada uno con:
   - `command` = la ruta del ejecutable del paso 1,
   - `env.MSSQL_CONNECTIONSTRING` = `${MSSQL_CONNSTR_<ALIAS>}` (expansión de variable;
     la contraseña nunca se escribe en el archivo),
   - modo seguro: `DatabaseConfiguration__EnableExecuteQuery=true` y
     `EnableExecuteStoredProcedure`, `EnableStartQuery`, `EnableStartStoredProcedure`
     en `false`.

5. Crea un lanzador PowerShell `db/claude-db.ps1` que: lea `db/.env` (ignorando
   comentarios y líneas vacías), exporte cada `KEY=VALUE` al entorno del proceso, y
   luego ejecute `claude` desde la raíz del repo pasando los argumentos recibidos.

6. Si conviene un usuario de solo lectura por base, prepárame un script SQL
   (`db/demo_readonly.sql`) con `CREATE LOGIN` + `db_datareader` (sin `db_datawriter`),
   pero **NO lo ejecutes tú**: crear logins es un cambio de seguridad, dámelo para
   ejecutarlo yo eligiendo la contraseña.

7. Dime los pasos manuales finales: copiar `db/.env.example` a `db/.env` y completar
   las cadenas, y arrancar Claude Code con `.\db\claude-db.ps1` (en vez de `claude`
   directo) para que cargue las variables. Luego valida listando tablas y con un
   `SELECT TOP 1` en cada base.

Recuerda: no subas secretos al repo, no crees logins ni cambies permisos por tu cuenta,
y deja las bases en solo lectura.

---

## Nota
Ese servidor MCP es **solo SQL Server**. Para PostgreSQL/MySQL/Oracle el patrón
(`.env` + lanzador + un bloque por base en `.mcp.json`) es idéntico, cambiando la
herramienta MCP del paso 1 por la del motor correspondiente.
