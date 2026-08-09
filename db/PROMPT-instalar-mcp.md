# Prompt para el equipo: instalar el MCP de SQL Server (AdventureWorks)

Copia **todo el bloque de abajo** y pégalo en Claude Code, dentro de la carpeta del
repo (`demo-playwright`). Requisitos previos: tener **SQL Server local** con la base
**AdventureWorks2025** restaurada y **.NET 10 SDK** instalado.

---

Quiero conectar Claude Code a mi SQL Server local (base `AdventureWorks2025` en
`localhost`) mediante un servidor MCP, en modo **solo lectura**. Ayúdame a dejarlo
configurado siguiendo estos pasos y verificando cada uno:

1. Comprueba que tengo `dotnet` (>= 10) disponible. Si no, detente y dime cómo instalarlo.

2. Instala el servidor MCP oficial de SQL Server como herramienta global de .NET:
   `dotnet tool install --global Ave.McpServer.MsSqlClient`
   Luego dame la ruta absoluta del ejecutable
   (`~/.dotnet/tools/ave-mcpserver-mssqlclient(.exe)`).

3. Verifica que el servicio de SQL Server está corriendo y que la base
   `AdventureWorks2025` existe y tiene datos (p. ej. cuenta filas de
   `Sales.SalesOrderHeader`). Usa `sqlcmd` con autenticación de Windows (`-E`).

4. Prepárame un script SQL (`db/demo_readonly.sql`) que cree un login
   **`demo_readonly`** acotado a `AdventureWorks2025` con permiso **solo lectura**
   (`db_datareader`, sin `db_datawriter`). NO lo ejecutes tú: crear un login es un
   cambio de seguridad; dámelo para ejecutarlo yo eligiendo la contraseña.

5. Crea/actualiza `.mcp.json` en la raíz del repo con un servidor MCP llamado
   `mssql-adventureworks` que:
   - use el ejecutable del paso 2 como `command`,
   - lea la cadena de conexión desde la variable de entorno `MSSQL_CONNECTIONSTRING`
     (NO escribas la contraseña en el archivo),
   - habilite `DatabaseConfiguration__EnableExecuteQuery=true` y deje en `false`
     `EnableExecuteStoredProcedure`, `EnableStartQuery` y `EnableStartStoredProcedure`.

6. Dime exactamente los comandos manuales que me faltan:
   - ejecutar `db/demo_readonly.sql` con `sqlcmd -S localhost -E -C -i db\demo_readonly.sql`,
   - definir `MSSQL_CONNECTIONSTRING` con `setx` apuntando a `demo_readonly` y la
     misma contraseña (formato:
     `Server=localhost;Database=AdventureWorks2025;User Id=demo_readonly;Password=...;TrustServerCertificate=True;Encrypt=True;`),
   - reiniciar Claude Code para que cargue `.mcp.json` y aprobar el servidor MCP.

7. Tras reiniciar, valida la conexión listando las tablas y haciendo un `SELECT`
   de prueba, y confirma que un intento de escritura (p. ej. un `DELETE`) es
   rechazado por permisos.

---
