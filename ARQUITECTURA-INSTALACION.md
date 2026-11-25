# Arquitectura e Instalación

## Arquitectura

- Frontend estático: HTML5, CSS3 y JavaScript.
- Hospedaje: GitHub Pages.
- Base de datos: Google Sheets.
- API: Google Apps Script.
- Autenticación: usuarios propios con contraseñas hash + sal y tokens de sesión con vencimiento.

La URL de la API puede configurarse en el frontend o guardarse localmente en `pie-seminarios-api-url`. El frontend incluye una URL predeterminada de servidor; para entrar explícitamente al demo añade `?demo=1` a la URL. La URL incluida en una página publicada es visible para sus visitantes y no debe tratarse como una contraseña.

## Puesta en marcha local

Desde la carpeta del proyecto, ejecutar `python3 -m http.server 8080`.

Abrir `http://localhost:8080/?demo=1` para usar datos locales de demostración. Sin `?demo=1`, se usa la URL de servidor configurada, también en localhost.

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

Para una instalación existente, sigue las precauciones de actualización indicadas abajo; no ejecutes las funciones de inicialización.

### Hojas creadas

`Periodos`, `Estudiantes`, `Evaluadores`, `Asignaciones`, `Evaluaciones`, `Usuarios`, `Configuracion`, `RubricaActual` y `Sesiones`.

La hoja `RubricaActual` contiene los criterios, alcance, descriptores y ponderaciones. Modifica sus filas para futuras evaluaciones: usa IDs únicos que comiencen con una letra y contengan solo letras, números, guiones o guiones bajos; marca los criterios vigentes como activos y verifica que sus ponderaciones sumen `1`. `Deslizador` activa el control deslizante para un criterio. Los descriptores corresponden a los rangos 90–100, 70–89, 50–69 y 0–49.

La hoja `Estudiantes` incluye la columna `Programa` (`MCIE` o `DIE`). Para una hoja existente, haz una copia de seguridad, actualiza Apps Script y ejecuta una vez `migrateStudentProgram()`; añade la columna sin borrar registros. Los alumnos existentes quedan sin programa hasta que se editen.

Al enviar una evaluación se guarda una copia de la rúbrica y su resultado. Los demás revisores de ese alumno y periodo usan esa misma copia aunque se edite la hoja; los cambios aplican a alumnos sin evaluaciones. No cambies los IDs de criterios de una evaluación ya iniciada esperando que cambien sus resultados.

### Actualizar una hoja existente

1. **Haz una copia de seguridad de todo el archivo de Google Sheets y suspende las capturas y la edición manual durante la actualización.** No ejecutes `setupSheets()` en una hoja existente: borra sus datos.
2. Prueba primero en una copia independiente de la hoja y del proyecto Apps Script. Esta actualización no requiere ejecutar migraciones para hojas ya compatibles.
3. Actualiza `Code.gs`, publica una nueva versión de la aplicación web y actualiza el frontend de forma coordinada antes de reanudar las capturas. El frontend y el backend nuevos deben instalarse juntos para conservar la selección de rúbrica del evaluador.
4. Comprueba el acceso, las asignaciones, evaluaciones y reportes con datos de prueba. Si hay un error de escritura o restauración, detén las capturas y revisa las hojas y la copia de seguridad antes de reintentar.

Las operaciones en varias hojas usan compensaciones ante errores, **no transacciones**: si también falla la restauración, pueden quedar cambios parciales. Los borrados múltiples y la desactivación de cuentas asociada al borrado de evaluadores conservan su comportamiento anterior y también pueden quedar incompletos si ocurre un error. Mantén respaldos y revisa el estado antes de reintentar.

Las funciones de migración son independientes de esta actualización. En particular, `migrateRubric()` elimina la hoja `Rubrica` anterior y borra las evaluaciones antiguas de escala 1–4 en todos los periodos; `replaceRubricWithDefault()` reemplaza la configuración de `RubricaActual`. No las ejecutes sin evaluar su necesidad, respaldar los datos y autorizar explícitamente esos cambios.

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
- Abrir `tests/evaluation-edit.html` en un navegador para comprobar la edición de evaluaciones y su límite diario.
- Abrir `tests/logout.html` en un navegador para comprobar el cierre y la revocación de sesiones simuladas.
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
