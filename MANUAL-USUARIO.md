# Manual de usuario de PIE-SEMI-EVAL

## 1. ¿Para qué sirve?

PIE-SEMI-EVAL permite organizar y evaluar seminarios de avance de tesis. El **administrador** registra periodos, estudiantes y evaluadores, asigna revisores y genera reportes. El **evaluador** consulta sus estudiantes asignados y captura sus evaluaciones.

## 2. Acceso y navegación

1. Abre [PIE-SEMI-EVAL](https://pie-fime.github.io/pie-seminarios/) en un navegador.
2. Escribe el **Usuario** y la **Contraseña** proporcionados por el administrador.
3. Pulsa **Iniciar sesión**.
4. Usa el menú lateral para ir a la sección deseada. En celular, pulsa **☰** para abrirlo y **×** para cerrarlo.
5. Al terminar, selecciona **Cerrar sesión**. Se cerrarán las ventanas y se descartarán los cambios que no hayas guardado; los datos guardados se conservan.

Puedes cambiar tu contraseña desde **Mi perfil** cuando hayas iniciado sesión. Si no puedes entrar o necesitas restablecerla, contacta al administrador técnico. No compartas tu contraseña con otras personas.

### Modo demostración y servidor

- **Modo demostración:** usa datos de ejemplo y guarda los cambios solamente en el navegador y dispositivo actuales. No se sincronizan con Google Sheets y pueden perderse si se borran los datos del navegador.
- **Servidor conectado:** la aplicación está configurada para usar Apps Script y Google Sheets. La etiqueta indica la configuración seleccionada, no garantiza que el servidor responda correctamente.

En modo demostración puedes entrar con `admin` / `admin123` o `evaluador` / `evaluador123`. Son credenciales públicas de prueba; no deben usarse para cuentas reales. Los evaluadores adicionales creados en el demo no pueden iniciar sesión con sus propias credenciales; para probar la evaluación utiliza la cuenta `evaluador`.

Si la página está configurada para usar el servidor, las credenciales del demo no sirven para acceder a él.

## 3. Guía del administrador

### 3.1. Consultar el resumen

En **Resumen** puedes consultar el periodo activo, el número de estudiantes y evaluadores, y el avance de las evaluaciones. El sistema espera tres evaluaciones por estudiante.

En **Mi perfil**, el administrador puede actualizar su nombre, usuario y contraseña. El cambio de contraseña requiere la contraseña actual y la confirmación de la nueva.

### 3.2. Crear y activar un periodo

1. Entra en **Periodos** y pulsa **Nuevo periodo**.
2. Escribe el nombre, la fecha de inicio y la fecha de fin; pulsa **Guardar periodo**.
3. El periodo se crea **inactivo**. Para activarlo, marca únicamente su casilla y pulsa **Activar periodo**.
4. Revisa el aviso y confirma. El periodo activo anterior se desactivará.

Solo puede haber un periodo activo a la vez. Para borrar periodos, selecciona sus casillas y pulsa **Borrar periodo**. La operación se bloquea si alguno tiene estudiantes, asignaciones o evaluaciones asociadas.

### 3.3. Registrar estudiantes

1. Entra en **Estudiantes** y pulsa **Nuevo**.
2. Completa matrícula, nombre, programa, semestre, director y título de tesis.
3. Selecciona la **Generación / cohorte** y pulsa **Guardar estudiante**.

El programa es obligatorio y debe ser **MCIE** o **DIE**. Puedes modificar un registro con **Editar**. Usa el campo de búsqueda y los filtros de director y cohorte para encontrar estudiantes; pulsa los encabezados de la tabla para ordenar.

### 3.4. Registrar evaluadores

1. Entra en **Evaluadores** y pulsa **Nuevo**.
2. Completa nombre, correo, usuario y contraseña temporal.
3. Pulsa **Guardar evaluador** y entrega las credenciales por un medio seguro.

Desde **Mi perfil**, cada evaluador puede actualizar su nombre, correo, usuario y contraseña. Para cambiar la contraseña debe proporcionar la contraseña actual y confirmar la nueva.

### 3.5. Importar directorios con CSV

1. En **Estudiantes** o **Evaluadores**, pulsa **Importar CSV**.
2. Pulsa **Descargar plantilla CSV** y complétala en una hoja de cálculo.
3. Guarda el archivo en formato CSV UTF-8. Puedes usar coma o punto y coma como separador.
4. En la aplicación, pulsa **Seleccionar archivo CSV**.
5. Corrige los errores que se muestren y vuelve a seleccionar el archivo. Cuando no haya errores, pulsa **Importar estudiantes** o **Importar evaluadores**.

Para estudiantes se requieren matrícula, nombre, programa, semestre, título y director de tesis. La generación o cohorte es opcional: si se omite, se usa el periodo activo.

Para evaluadores se requieren nombre, correo, usuario y contraseña temporal. **El CSV contiene contraseñas en texto legible**: mantenlo protegido, no lo subas a GitHub y elimínalo de forma segura cuando ya no lo necesites.

### 3.6. Exportar o borrar registros

En **Estudiantes** o **Evaluadores**, marca las casillas de las filas y pulsa **Exportar CSV** o **Borrar**. Puedes seleccionar varias filas. La selección puede conservar registros ocultos por los filtros; revísala antes de borrar.

Las contraseñas no se incluyen en la exportación de evaluadores. El borrado se bloquea si algún registro seleccionado tiene asignaciones o evaluaciones asociadas, incluso históricas. Al borrar un evaluador sin registros asociados, se desactiva su cuenta de acceso.

### 3.7. Asignar revisores

1. Verifica que esté activo el periodo correspondiente y que existan el estudiante y los evaluadores.
2. Entra en **Asignaciones** y pulsa **Asignar** en la fila del estudiante.
3. Marca hasta **tres evaluadores diferentes** y pulsa **Guardar asignación**. Puedes completar la asignación más adelante o desmarcar todos para quitarla.

Los evaluadores que ya enviaron su evaluación no pueden retirarse. Para obtener el promedio final se requieren tres evaluaciones. La lista muestra únicamente estudiantes del periodo activo; si está vacía, revisa su cohorte y el periodo activo.

### 3.8. Crear otro administrador

En **Administradores**, pulsa **Nuevo administrador**. Captura nombre, usuario o correo y una contraseña de al menos 12 caracteres; confírmala y pulsa **Crear administrador**. La nueva cuenta tiene los mismos permisos que la tuya. En el demo funciona solo en ese navegador.

### 3.9. Generar reportes

1. Entra en **Reportes** y selecciona el tipo: **Por alumno**, **Por periodo de evaluación** o **Por revisor**.
2. Selecciona el periodo y, cuando corresponda, el alumno o revisor. En los reportes por periodo y por revisor puedes filtrar por semestre y programa.
3. Pulsa **Visualizar reporte**.
4. Al final del reporte, usa **Descargar CSV** o **Imprimir / Guardar PDF**. Para obtener un PDF, selecciona «Guardar como PDF» en el diálogo de impresión del navegador.

El reporte individual presenta los criterios, las calificaciones y observaciones de los revisores. Debajo de la tabla aparece la calificación final, que permanece **Pendiente** hasta contar con las tres evaluaciones. Protege los reportes descargados y compártelos solo con personas autorizadas.

## 4. Guía del evaluador

### 4.1. Consultar estudiantes

Al iniciar sesión aparece **Mis estudiantes**, con los asignados en el periodo activo y su estado: **Pendiente** o **Completada**. Si falta un estudiante, consulta al administrador para verificar el periodo y la asignación.

### 4.2. Capturar y enviar una evaluación

1. Pulsa **Evaluar** en la fila del estudiante.
2. En cada criterio, abre **Ver rúbrica** para consultar los niveles y descriptores.
3. Selecciona explícitamente un puntaje entero de **0 a 100** con cada deslizador, incluso si deseas conservar el valor que aparece inicialmente.
4. Revisa la calificación individual calculada y escribe, si lo deseas, las **Observaciones generales**.
5. Pulsa **Guardar y enviar evaluación** y espera el mensaje de confirmación.

La calificación individual combina los puntajes según las ponderaciones de la rúbrica. La calificación final del estudiante se calcula cuando se han recibido las tres evaluaciones.

En la rúbrica predeterminada, el tiempo de presentación es un criterio que se califica con el deslizador: hasta 10 minutos corresponde al nivel sobresaliente; más de 10 y menos de 11, satisfactorio; de 11 a 15, en desarrollo; y más de 15, insuficiente. No se captura el tiempo ni se aplica una penalización automática en esa rúbrica.

### 4.3. Editar o consultar una evaluación enviada

En **Mis estudiantes**, pulsa **Editar** junto al estudiante para corregir tu evaluación y guardar los cambios. Puedes hacerlo únicamente durante el día calendario en que la enviaste, hasta la medianoche de Monterrey, aunque guardes cambios varias veces.

Al día siguiente aparece **Consultar** y la evaluación queda en modo de lectura. Las evaluaciones sin una fecha de envío válida también quedan solo para consulta. Si detectas un error después del plazo, contacta al administrador.

## 5. Problemas frecuentes

| Situación | Qué hacer |
|---|---|
| No puedo iniciar sesión | Comprueba usuario y contraseña; verifica si estás en demo o en el servidor. Si continúa el problema, contacta al administrador. |
| No aparecen estudiantes asignados | Pide al administrador que compruebe el periodo activo y las asignaciones. |
| Un periodo nuevo aparece inactivo | Selecciona su casilla en **Periodos**, pulsa **Activar periodo** y confirma. |
| No puedo enviar una evaluación | Selecciona un puntaje en todos los criterios y revisa el mensaje de error. Si cambió el periodo, abre nuevamente el formulario. |
| La calificación final aparece pendiente | Verifica que los tres revisores hayan enviado sus evaluaciones. |
| No puedo importar un CSV | Revisa la plantilla, los campos requeridos, los duplicados y los errores indicados. Corrige el archivo y vuelve a seleccionarlo. |
| Los cambios de demo no aparecen en otro dispositivo | Es normal: el demo guarda los datos solo en el navegador donde se capturaron. |

Para la configuración técnica de Google Sheets y Apps Script, consulta el [README](README.md).
