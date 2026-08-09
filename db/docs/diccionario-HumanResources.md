# Diccionario de Datos — Esquema `HumanResources`

> Base de datos: **AdventureWorks** · Esquema: **HumanResources**
> Generado el 2026-08-03 a partir de los metadatos del catálogo del sistema (`sys.*`) y las descripciones extendidas (`MS_Description`).

## Resumen del esquema

| Tabla | Descripción | Nº columnas | Filas |
| --- | --- | :---: | ---: |
| [Department](#department) | Tabla de catálogo con los departamentos de la empresa. | 4 | 16 |
| [Employee](#employee) | Información de empleados: salario, cargo, departamento, etc. | 16 | 290 |
| [EmployeeDepartmentHistory](#employeedepartmenthistory) | Traslados de empleados entre departamentos. | 6 | 296 |
| [EmployeePayHistory](#employeepayhistory) | Historial de cambios de sueldo de los empleados. | 5 | 316 |
| [JobCandidate](#jobcandidate) | Currículums enviados a Recursos Humanos. | 4 | 13 |
| [Shift](#shift) | Tabla de catálogo de turnos de trabajo. | 5 | 3 |

**Convenciones:** `PK` = clave primaria · `FK` = clave foránea · Longitud en caracteres para tipos de texto · `Name` = tipo definido por usuario (`nvarchar(50)`) · `Flag` = tipo definido por usuario (`bit`).

---

## Department

Tabla de catálogo que contiene los departamentos de la empresa.

| # | Columna | Tipo | Long. | Nulo | Clave | Descripción |
|---:| --- | --- | :---: | :---: | :---: | --- |
| 1 | DepartmentID | smallint | | NO | PK | Clave primaria del departamento (IDENTITY). |
| 2 | Name | Name (nvarchar) | 50 | NO | | Nombre del departamento. |
| 3 | GroupName | Name (nvarchar) | 50 | NO | | Nombre del grupo al que pertenece el departamento. |
| 4 | ModifiedDate | datetime | | NO | | Fecha y hora de la última actualización del registro. |

---

## Employee

Información de los empleados, como salario, cargo y datos de recursos humanos.

| # | Columna | Tipo | Long. | Nulo | Clave | Descripción |
|---:| --- | --- | :---: | :---: | :---: | --- |
| 1 | BusinessEntityID | int | | NO | PK, FK | Clave primaria del empleado. FK → `Person.Person.BusinessEntityID`. |
| 2 | NationalIDNumber | nvarchar | 15 | NO | | Número de identificación nacional único (p. ej. seguridad social). |
| 3 | LoginID | nvarchar | 256 | NO | | Login de red. |
| 4 | OrganizationNode | hierarchyid | | SÍ | | Ubicación del empleado en la jerarquía corporativa. |
| 5 | OrganizationLevel | smallint | | SÍ | | Profundidad del empleado en la jerarquía (columna calculada). |
| 6 | JobTitle | nvarchar | 50 | NO | | Título del puesto (p. ej. Buyer, Sales Representative). |
| 7 | BirthDate | date | | NO | | Fecha de nacimiento. |
| 8 | MaritalStatus | nchar | 1 | NO | | Estado civil: `M` = Casado/a, `S` = Soltero/a. |
| 9 | Gender | nchar | 1 | NO | | Sexo: `M` = Hombre, `F` = Mujer. |
| 10 | HireDate | date | | NO | | Fecha de contratación. |
| 11 | SalariedFlag | Flag (bit) | | NO | | Clasificación laboral: `0` = Por horas, `1` = Asalariado. |
| 12 | VacationHours | smallint | | NO | | Horas de vacaciones disponibles. |
| 13 | SickLeaveHours | smallint | | NO | | Horas de baja por enfermedad disponibles. |
| 14 | CurrentFlag | Flag (bit) | | NO | | Estado: `0` = Inactivo, `1` = Activo. |
| 15 | rowguid | uniqueidentifier | | NO | | GUID de fila (soporte para replicación de mezcla). |
| 16 | ModifiedDate | datetime | | NO | | Fecha y hora de la última actualización del registro. |

---

## EmployeeDepartmentHistory

Traslados de empleados entre departamentos (histórico). La clave primaria es compuesta.

| # | Columna | Tipo | Long. | Nulo | Clave | Descripción |
|---:| --- | --- | :---: | :---: | :---: | --- |
| 1 | BusinessEntityID | int | | NO | PK, FK | Nº de empleado. FK → `HumanResources.Employee.BusinessEntityID`. |
| 2 | DepartmentID | smallint | | NO | PK, FK | Departamento en el que trabajó/trabaja. FK → `HumanResources.Department.DepartmentID`. |
| 3 | ShiftID | tinyint | | NO | PK, FK | Turno de 8 horas del empleado. FK → `HumanResources.Shift.ShiftID`. |
| 4 | StartDate | date | | NO | PK | Fecha en que el empleado comenzó en el departamento. |
| 5 | EndDate | date | | SÍ | | Fecha en que el empleado dejó el departamento. `NULL` = departamento actual. |
| 6 | ModifiedDate | datetime | | NO | | Fecha y hora de la última actualización del registro. |

---

## EmployeePayHistory

Historial de cambios de sueldo de los empleados. La clave primaria es compuesta.

| # | Columna | Tipo | Long. | Nulo | Clave | Descripción |
|---:| --- | --- | :---: | :---: | :---: | --- |
| 1 | BusinessEntityID | int | | NO | PK, FK | Nº de empleado. FK → `HumanResources.Employee.BusinessEntityID`. |
| 2 | RateChangeDate | datetime | | NO | PK | Fecha en que el cambio de sueldo entra en vigor. |
| 3 | Rate | money | | NO | | Tarifa/sueldo por hora. |
| 4 | PayFrequency | tinyint | | NO | | Frecuencia de pago: `1` = mensual, `2` = quincenal. |
| 5 | ModifiedDate | datetime | | NO | | Fecha y hora de la última actualización del registro. |

---

## JobCandidate

Currículums (résumés) enviados a Recursos Humanos por candidatos a un puesto.

| # | Columna | Tipo | Long. | Nulo | Clave | Descripción |
|---:| --- | --- | :---: | :---: | :---: | --- |
| 1 | JobCandidateID | int | | NO | PK | Clave primaria del candidato (IDENTITY). |
| 2 | BusinessEntityID | int | | SÍ | FK | Nº de empleado si el candidato fue contratado. FK → `HumanResources.Employee.BusinessEntityID`. |
| 3 | Resume | xml | | SÍ | | Currículum en formato XML. |
| 4 | ModifiedDate | datetime | | NO | | Fecha y hora de la última actualización del registro. |

---

## Shift

Tabla de catálogo de turnos de trabajo.

| # | Columna | Tipo | Long. | Nulo | Clave | Descripción |
|---:| --- | --- | :---: | :---: | :---: | --- |
| 1 | ShiftID | tinyint | | NO | PK | Clave primaria del turno (IDENTITY). |
| 2 | Name | Name (nvarchar) | 50 | NO | | Descripción del turno. |
| 3 | StartTime | time | | NO | | Hora de inicio del turno. |
| 4 | EndTime | time | | NO | | Hora de fin del turno. |
| 5 | ModifiedDate | datetime | | NO | | Fecha y hora de la última actualización del registro. |

---

## Relaciones (claves foráneas)

| Constraint | Tabla origen | Columna | → Tabla destino | Columna |
| --- | --- | --- | --- | --- |
| FK_Employee_Person_BusinessEntityID | Employee | BusinessEntityID | Person.Person | BusinessEntityID |
| FK_EmployeeDepartmentHistory_Employee_BusinessEntityID | EmployeeDepartmentHistory | BusinessEntityID | HumanResources.Employee | BusinessEntityID |
| FK_EmployeeDepartmentHistory_Department_DepartmentID | EmployeeDepartmentHistory | DepartmentID | HumanResources.Department | DepartmentID |
| FK_EmployeeDepartmentHistory_Shift_ShiftID | EmployeeDepartmentHistory | ShiftID | HumanResources.Shift | ShiftID |
| FK_EmployeePayHistory_Employee_BusinessEntityID | EmployeePayHistory | BusinessEntityID | HumanResources.Employee | BusinessEntityID |
| FK_JobCandidate_Employee_BusinessEntityID | JobCandidate | BusinessEntityID | HumanResources.Employee | BusinessEntityID |
