# Demo: Claude + SQL Server (AdventureWorks) vía MCP

Esta demo conecta **Claude Code** a **SQL Server** (base `AdventureWorks2025` en
`localhost`) usando un **servidor MCP** (Model Context Protocol). Claude traduce
lenguaje natural → SQL, lo ejecuta y explica los resultados.

## Arquitectura (30 segundos para el equipo)

```
Tú (lenguaje natural)  →  Claude Code  →  servidor MCP (ave-mcpserver-mssqlclient)
                                              │  herramientas: list_tables,
                                              │  get_table_schema, execute_query...
                                              ▼
                                       SQL Server  →  AdventureWorks2025
                                       (login demo_readonly = SOLO LECTURA)
```

Claude **no** habla SQL por sí solo: el servidor MCP le expone *herramientas*
(listar tablas, ver esquema, ejecutar consultas). Config en [`../.mcp.json`](../.mcp.json).

## Seguridad de la demo

- **Login dedicado `demo_readonly`** con permiso `db_datareader` únicamente.
- La herramienta MCP tiene `execute_query` habilitado, pero cualquier escritura
  (`INSERT/UPDATE/DELETE`, DDL) la **rechaza el motor** por falta de permisos.
- La contraseña **no se guarda en el repo**: va en la variable de entorno
  `MSSQL_CONNECTIONSTRING`.

## Puesta en marcha (una vez)

1. **Crear el usuario de solo lectura** (elige una contraseña fuerte en el script):

   ```bash
   sqlcmd -S localhost -E -C -i db\demo_readonly.sql
   ```

2. **Definir la cadena de conexión** como variable de entorno de usuario
   (usa la MISMA contraseña del paso 1):

   ```powershell
   setx MSSQL_CONNECTIONSTRING "Server=localhost;Database=AdventureWorks2025;User Id=demo_readonly;Password=TU_CONTRASENA;TrustServerCertificate=True;Encrypt=True;"
   ```

   > `setx` afecta a sesiones **nuevas**: cierra y reabre la terminal (y Claude Code) después.

3. **Reiniciar Claude Code** para que cargue `.mcp.json`. Al aparecer un servidor
   MCP nuevo, Claude Code pide aprobarlo: acéptalo. Verifica con `/mcp`.

## Guion sugerido para la demo (de menos a más)

1. **Descubrir el esquema** — *"¿Qué tablas tiene AdventureWorks y cómo se relacionan las de ventas?"*
2. **Consulta simple** — *"Muéstrame los 10 clientes con más pedidos."*
3. **JOIN + agregación** — *"Top 5 productos por importe vendido en 2013, con su categoría."*
4. **Análisis** — *"Compara ventas por territorio y dame un resumen ejecutivo."*
5. **Cierre de seguridad** — *"Borra el cliente con id 1"* → falla por permisos:
   demuestra que el candado de solo-lectura funciona.

## Notas de portabilidad (para compañeros)

- `.mcp.json` usa la ruta absoluta del ejecutable en la máquina del presentador.
  Si un compañero lo corre, que instale la herramienta y ajuste el `command`:

  ```bash
  dotnet tool install --global Ave.McpServer.MsSqlClient
  ```

  (Requiere .NET 10 SDK.) Si `~/.dotnet/tools` está en el PATH, basta con
  `ave-mcpserver-mssqlclient` como `command`.
