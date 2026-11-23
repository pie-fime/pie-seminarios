# SEMI-TESIS

Aplicación web responsiva para administrar y evaluar seminarios de avance de tesis de la Maestría en Ingeniería Eléctrica.

## Arquitectura

- Frontend estático: HTML5, CSS3 y JavaScript.
- Hospedaje: GitHub Pages.
- Base de datos: Google Sheets.
- API: Google Apps Script.
- Autenticación: usuarios propios con contraseñas hash + sal y tokens de sesión con vencimiento.

La URL de la API puede configurarse en el frontend o guardarse localmente en `pie-seminarios-api-url`. Sin URL configurada, el frontend funciona en modo demostración. La URL incluida en una página publicada es visible para sus visitantes y no debe tratarse como una contraseña.

Esta versión debe utilizarse únicamente con datos de prueba hasta corregir las limitaciones de seguridad, incluida la exposición de evaluaciones de otros revisores a evaluadores autenticados.

## Puesta en marcha local

Desde la carpeta del proyecto, ejecutar `python3 -m http.server 8080`.

Abrir `http://localhost:8080`.

Modo demostración:

- Administrador: `admin` / `admin123`
- Evaluador: `evaluador` / `evaluador123`

Estas credenciales iniciales son exclusivas del modo demostración y no deben utilizarse para cuentas reales. Si las cambias desde el perfil, utiliza las nuevas para entrar. El demo incluye registros de ejemplo y permite probar altas y asignaciones. Los cambios se guardan en el almacenamiento local de ese navegador y no se sincronizan entre dispositivos ni con Google Sheets.

## Configurar Google Sheets y Apps Script

1. Crear una hoja nueva y mantener restringido su acceso.
2. Abrir **Extensiones > Apps Script**.
3. Sustituir el contenido de `Code.gs` por `backend/Code.gs`.
4. Añadir `appsscript.json` mediante **Configuración del proyecto > Mostrar el manifiesto** o el complemento `clasp`.
5. En **Configuración del proyecto > Propiedades del script**, añadir `SPREADSHEET_ID` con el ID de la hoja de cálculo.
6. Ejecutar una sola vez `setupSheets()` para crear las hojas y la rúbrica base. Esta función borra el contenido de las pestañas administradas si ya existen.
7. Añadir temporalmente la propiedad `ADMIN_INITIAL_PASSWORD` con una contraseña larga y única. Ejecutar `createFirstAdmin()` y comprobar que la columna `Usuario` de la hoja `Usuarios` contiene el correo de la cuenta activa. Después, eliminar `ADMIN_INITIAL_PASSWORD` de las propiedades del script.
8. En Apps Script seleccionar **Implementar > Nueva implementación > Aplicación web**.
9. Configurar **Ejecutar como: yo** y **Quién tiene acceso: cualquier persona**.
10. Copiar la URL terminada en `/exec`.

Cada usuario puede actualizar su perfil y contraseña desde **Mi perfil**. Restringe el acceso de edición a la hoja y al proyecto Apps Script. No guardes contraseñas, exportaciones de datos reales ni tokens en el repositorio.
En instalaciones existentes, actualiza `backend/Code.gs` en Apps Script y publica una nueva versión de la aplicación web para habilitar el perfil.

### Hojas creadas

`Periodos`, `Estudiantes`, `Evaluadores`, `Asignaciones`, `Evaluaciones`, `Usuarios`, `Configuracion`, `RubricaActual` y `Sesiones`.

La hoja `RubricaActual` contiene los criterios, alcance, descriptores y ponderaciones. Modifica sus filas para futuras evaluaciones: usa IDs únicos que comiencen con una letra y contengan solo letras, números, guiones o guiones bajos; marca los criterios vigentes como activos y verifica que sus ponderaciones sumen `1`. `Deslizador` activa el control deslizante para un criterio. Los descriptores corresponden a los rangos 90–100, 70–89, 50–69 y 0–49.

La hoja `Estudiantes` incluye la columna `Programa` (`MCIE` o `DIE`). Para una hoja existente, haz una copia de seguridad, actualiza Apps Script y ejecuta una vez `migrateStudentProgram()`; añade la columna sin borrar registros. Los alumnos existentes quedan sin programa hasta que se editen.

Al enviar una evaluación se guarda una copia de la rúbrica y su resultado. Los demás revisores de ese alumno y periodo usan esa misma copia aunque se edite la hoja; los cambios aplican a alumnos sin evaluaciones. No cambies los IDs de criterios de una evaluación ya iniciada esperando que cambien sus resultados.

### Actualizar una hoja existente

1. **Haz una copia de seguridad de todo el archivo de Google Sheets y suspende las capturas durante la actualización.** No ejecutes `setupSheets()` en una hoja existente: borra sus datos.
2. Actualiza `Code.gs` en Apps Script y ejecuta `migrateRubric()`. La función crea `RubricaActual` si todavía no existe y elimina la hoja `Rubrica` anterior.
3. La migración **borra las evaluaciones anteriores de escala 1–4 en todas las cohortes**, sin borrar estudiantes, evaluadores ni asignaciones. Conserva las evaluaciones que ya se hayan hecho con la rúbrica 0–100 y sus copias de configuración.
4. Ejecuta `replaceRubricWithDefault()` para instalar los nueve aspectos aprobados. **Esto reemplaza la configuración actual de `RubricaActual`**, incluyendo cualquier edición personalizada, pero no borra evaluaciones. Los alumnos con evaluaciones ya enviadas continúan usando su copia de rúbrica.
5. Publica una nueva versión de la aplicación web de Apps Script y actualiza el frontend antes de reanudar las capturas. Si la migración falla, revisa el error y restaura la copia antes de reintentar; no elimines columnas ni hojas manualmente para forzarla.

## Conectar el frontend

Editar temporalmente desde la consola del navegador:

```javascript
API.setUrl('https://script.google.com/macros/s/ID_DEL_DESPLIEGUE/exec');
location.reload();
```

La URL queda almacenada en `localStorage`.

Para usar la misma URL en todos los dispositivos, configúrala como valor predeterminado de `baseUrl` en `js/api.js`. Será visible en la página publicada; no incluyas contraseñas ni claves privadas en ese archivo.

## Publicar en GitHub Pages

En un repositorio público, revisa cuidadosamente los archivos antes de subirlos. Para publicar la página bastan `index.html`, `css/` y `js/`. En GitHub abre **Settings > Pages**, selecciona la rama `main`, carpeta `/ (root)` y guarda.

## Uso

En celulares, abre el menú con ☰. Se cierra al elegir una opción, al tocar fuera de él o al pulsar ×.

1. Crear o importar estudiantes con el CSV: `Matricula,Nombre,Programa,Semestre,Titulo de tesis,Director de tesis`. El programa es obligatorio y debe ser `MCIE` o `DIE`.
2. Crear evaluadores y asignarles contraseñas temporales.
3. Asignar hasta tres evaluadores diferentes a cada estudiante del periodo activo; pueden agregarse gradualmente. No se puede retirar a quien ya envió su evaluación.
4. Cada evaluador selecciona con el deslizador una calificación entera de 0 a 100 para cada criterio, puede abrir sus descriptores con **Ver rúbrica** y escribir observaciones generales para la evaluación. Debe seleccionar explícitamente todos los puntajes antes de enviar.
5. El sistema calcula `suma(ponderación × calificación)` y conserva dos decimales. El tiempo de presentación es un criterio independiente: 10 minutos o menos es sobresaliente; más de 10 y menos de 11, satisfactorio; de 11 a 15, en desarrollo; y más de 15, insuficiente. Se califica con el deslizador, sin registrar tiempos ni aplicar penalización.
6. El promedio final aparece únicamente después de enviar tres evaluaciones.

Para habilitar las asignaciones parciales en una instalación existente, actualiza el frontend y `backend/Code.gs`, y publica una nueva versión de Apps Script.

En **Administradores > Nuevo administrador**, un administrador puede crear otra cuenta con los mismos permisos. Indica nombre, usuario y una contraseña de al menos 12 caracteres. Todavía no existe cambio de contraseña en la aplicación. En el demo estas cuentas solo funcionan en el navegador donde se crearon.

Para activar esta opción en una instalación existente, actualiza el frontend y el código de Apps Script y publica una nueva versión de la implementación. Conserva los ajustes específicos del servidor, como `ss()` y la configuración del primer administrador; no ejecutes `setupSheets()` ni `createFirstAdmin()` de nuevo.

### Importar y exportar directorios

En las páginas de **Estudiantes** y **Evaluadores**, usa **Importar CSV** para abrir la guía y descargar una plantilla. Para estudiantes se requieren `Matricula,Nombre,Programa,Semestre,Titulo de tesis,Director de tesis`; `Programa` debe ser `MCIE` o `DIE` y `Generacion / cohorte` es opcional y, si falta, se usa el periodo activo. Los CSV antiguos sin programa deben completarse antes de importarlos. Para evaluadores se requieren `Nombre,Correo,Usuario,Contrasena temporal`.

Marca las casillas de la primera columna y elige **Exportar CSV**. Las contraseñas de evaluadores nunca se exportan. Los encabezados de la tabla permiten ordenar; los filtros de estudiantes incluyen director y cohorte.

Para borrar, selecciona las filas y pulsa **Borrar**. La selección puede incluir registros ocultos por los filtros. Se solicita confirmación y se bloquea toda la operación si algún registro tiene asignaciones o evaluaciones, incluso históricas. Al borrar un evaluador sin registros asociados, se desactiva su cuenta de acceso.

En **Periodos**, usa **Nuevo periodo** para registrar su nombre y fechas. Se crea inactivo sin modificar el periodo activo. Para activarlo, marca únicamente su casilla y pulsa **Activar periodo**; tras confirmar, el periodo activo anterior se desactiva.

Para borrar, marca los periodos deseados o usa la casilla del encabezado para seleccionarlos todos, y pulsa **Borrar periodo**. Se pide confirmación y se bloquea toda la operación si alguno tiene estudiantes, asignaciones o evaluaciones asociadas.

## Reportes

En **Reportes**, selecciona por alumno, generación/cohorte o revisor y pulsa **Visualizar reporte**. Después de visualizarlo, al final aparecerán los controles para descargarlo como CSV o imprimirlo; en el diálogo de impresión se puede seleccionar **Guardar como PDF**. Los reportes de alumno muestran la matriz por criterio (R1, R2 y R3) y concentran solo las observaciones generales de los revisores; los reportes de generación y revisor no presentan promedio final cuando faltan evaluaciones.

Al cargar el demo actualizado se eliminan sus evaluaciones anteriores de escala 1–4; los registros de estudiantes, evaluadores y asignaciones se conservan.

## Pruebas

Validar la sintaxis JavaScript:

```bash
node --check js/calculations.js
node --check js/api.js
node --check js/auth.js
node --check js/admin.js
node --check js/evaluator.js
node --check js/reports.js
node --check js/app.js
```

Escenarios manuales mínimos:

- Abrir `tests/profile.html` en un navegador para comprobar las pruebas de perfil con datos simulados.
- Abrir `tests/csv-import.html` en un navegador para probar la importación de estudiantes con matrículas numéricas y de texto.
- Abrir `tests/assignments.html` en un navegador para probar asignaciones parciales y protección de evaluaciones enviadas.
- Abrir `tests/reports.html` en un navegador para comprobar los nombres en los comentarios del reporte.
- Inicio de sesión de administrador y evaluador.
- Actualización del perfil propio y cambio de contraseña con verificación de la contraseña actual.
- Registro e importación CSV de estudiantes.
- Importación CSV guiada para estudiantes/evaluadores, validación de filas y selección/exportación CSV.
- Filtros por director, cohorte y estado; ordenamiento al pulsar encabezados.
- Alta de evaluadores.
- Tres asignaciones diferentes por estudiante.
- Evaluación independiente sin mostrar evaluaciones ajenas.
- Duplicados rechazados.
- Promedio visible solo con tres evaluaciones completas.
- Permisos validados en Apps Script.
