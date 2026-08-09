# Prompt reutilizable: conectar Claude a CUALQUIER base de datos SQL Server vía MCP

## Cómo usarlo

1. Elige un **alias** corto para la base (ej. `ventas`, `orbit`, `risk`).
2. Guarda la **cadena de conexión** en una variable de entorno cuyo nombre siga el
   patrón `MSSQL_CONNSTR_<ALIAS_EN_MAYUS>`. Ejemplo:

   ```powershell
   setx MSSQL_CONNSTR_VENTAS "Server=localhost;Database=Ventas;User Id=usuario;Password=***;TrustServerCertificate=True;Encrypt=True;"
   ```

   > `setx` aplica a terminales **nuevas**: reabre la terminal y Claude Code después.

3. Pega el prompt de abajo en Claude Code, sustituyendo `{{ALIAS}}`.

---

## PROMPT (copia y reemplaza {{ALIAS}})

Quiero conectar Claude Code a una base de datos SQL Server usando un servidor MCP,
identificada por el alias `{{ALIAS}}`. La cadena de conexión NO va en texto: está en
la variable de entorno `MSSQL_CONNSTR_{{ALIAS_MAYUS}}`. Haz lo siguiente y verifica
cada paso:

1. Confirma que la variable de entorno `MSSQL_CONNSTR_{{ALIAS_MAYUS}}` existe en mi
   sesión. Si no, detente y recuérdame definirla con `setx` y reabrir la terminal.

2. Asegúrate de que el servidor MCP de SQL Server está instalado como herramienta
   global de .NET; si falta, instálalo:
   `dotnet tool install --global Ave.McpServer.MsSqlClient`
   y obtén la ruta absoluta del ejecutable
   (`~/.dotnet/tools/ave-mcpserver-mssqlclient(.exe)`).

3. Añade (sin borrar los existentes) un servidor llamado `mssql-{{ALIAS}}` al
   `.mcp.json` de la raíz del repo, con:
   - `command` = la ruta del ejecutable del paso 2,
   - `env.MSSQL_CONNECTIONSTRING` = `${MSSQL_CONNSTR_{{ALIAS_MAYUS}}}`
     (expansión de variable de entorno; la contraseña NUNCA se escribe en el archivo),
   - modo seguro por defecto: `DatabaseConfiguration__EnableExecuteQuery=true` y
     `EnableExecuteStoredProcedure`, `EnableStartQuery`, `EnableStartStoredProcedure`
     en `false`.

4. Dime que reinicie Claude Code para cargar el nuevo servidor MCP y que lo apruebe.

5. Tras reiniciar, valida la conexión: lista las tablas y ejecuta un `SELECT TOP 1`
   de prueba contra la base del alias `{{ALIAS}}`.

Recuerda: NO crees logins ni cambies permisos del servidor por tu cuenta (es un
cambio de seguridad). Si conviene un usuario de solo lectura, dame el script SQL
para ejecutarlo yo.

---

## Nota: otros motores (PostgreSQL, MySQL, Oracle, SQLite…)

El patrón es el mismo, solo cambia el **servidor MCP** (uno por motor). En el paso 2
del prompt, sustituye la herramienta por la del motor correspondiente y, en el paso 3,
usa el nombre y las variables de entorno que ese servidor documente. El resto
—alias, cadena en variable de entorno, un bloque por base en `.mcp.json`, validar con
un `SELECT`— es idéntico.
