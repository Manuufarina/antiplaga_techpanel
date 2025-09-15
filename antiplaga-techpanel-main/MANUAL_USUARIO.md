# Manual de Usuario – Antiplaga Tech

## 1. Presentación general
Antiplaga Tech es la aplicación móvil que los técnicos utilizan para gestionar sus visitas de control de plagas e incidentes asociados. Este manual describe todas las pantallas y funcionalidades disponibles, así como los pasos para ejecutarlas correctamente.

## 2. Acceso y autenticación
### 2.1. Requisitos previos
- Contar con un usuario y contraseña provistos por Antiplaga Norte.
- Disponer de conexión a internet para iniciar sesión y sincronizar información.
- Permitir el acceso a la cámara y a las fotos del dispositivo para poder adjuntar imágenes en visitas e incidentes.

### 2.2. Iniciar sesión
1. Abra la aplicación. Se mostrará el logotipo de Antiplaga y el formulario de ingreso.
2. Complete el **Nombre de usuario** y la **Password** en los campos correspondientes.
3. Pulse sobre el botón **Sign In**. Mientras se procesa la autenticación el botón muestra un indicador de carga.
4. Si las credenciales son correctas, la aplicación lo llevará automáticamente a la pantalla de **Inicio**.
5. Si ocurre un error (por ejemplo, credenciales inválidas o problemas de conexión), se mostrará un mensaje en rojo bajo el formulario. Corrija los datos o reintente cuando la conexión esté disponible.

### 2.3. Cambiar el ambiente (local / test / prod)
1. Desde la pantalla de inicio de sesión toque el logotipo de Antiplaga seis veces consecutivas.
2. Aparecerá un aviso emergente indicando el nuevo ambiente seleccionado. El orden de los ambientes es: `prod → local → test → prod`.
3. El ambiente activo se muestra en texto gris debajo del botón de ingreso para que pueda confirmarlo.

## 3. Navegación general de la aplicación
- En la parte inferior de la interfaz hay una barra de pestañas con cuatro accesos permanentes: **Inicio**, **Sucursales**, **Incidentes** y **Perfil**.
- Puede cambiar de módulo tocando el ícono o deslizando hacia la pestaña deseada.
- Desde cualquier módulo puede iniciar la creación o edición de visitas; el flujo de visitas se abre en una navegación aparte bajo la ruta `/new-visit`.
- Cuando la aplicación necesita procesar información (por ejemplo, al cargar datos maestros o guardar una visita) aparece un recubrimiento con un spinner negro indicando que se debe esperar.

## 4. Pantalla Inicio
### 4.1. Información principal
- La cabecera muestra el texto **AntiplagaNorte** y un saludo con el nombre del técnico.
- Debajo se visualiza el logotipo de la empresa y el número de versión actual de la aplicación.

### 4.2. Gestionar “Visitas sin terminar”
1. Abra el acordeón **Visitas sin terminar**. El título muestra la cantidad de borradores guardados.
2. Toque la tarjeta de la visita pendiente que desea retomar.
3. Se indicará cuántos pasos faltan para completarla y la fecha de guardado.
4. Presione **Continuar** para cargar el borrador y será redirigido al tablero de la visita.

### 4.3. Gestionar “Visitas offline”
1. Abra el acordeón **Visitas offline** para ver los informes que no pudieron sincronizarse.
2. Cada elemento muestra el nombre de la planilla, el número de visita y la fecha. Un ícono rojo indica que sigue pendiente.
3. Para reintentar el envío individual toque la fila correspondiente. Si el proceso está en curso aparecerá un spinner amarillo.
4. Para reenviar todas las visitas pendientes a la vez use el botón **Reintentar todas** ubicado debajo de la lista.

### 4.4. Revisar “Últimas visitas”
1. Abra el acordeón **Últimas visitas**. Se listan las visitas confirmadas más recientes junto con aquellas que estaban offline y lograron sincronizarse.
2. Toque una visita para abrirla en modo edición dentro del flujo de nueva visita.
3. Desde allí podrá revisar la información cargada, realizar ajustes y volver a guardarla si fuera necesario.

## 5. Módulo Sucursales
### 5.1. Consultar sucursales disponibles
1. Entre en la pestaña **Sucursales**. El sistema descarga automáticamente las sucursales asociadas al usuario.
2. Cada item muestra el nombre de la sucursal, el cliente y, si está disponible, la dirección. Los íconos ayudan a identificar el tipo de dato.
3. Si la lista aún está cargando se mostrará un spinner; espere a que finalice para interactuar.

### 5.2. Seleccionar una sucursal y planilla
1. Toque la sucursal deseada para ingresar a su detalle.
2. En la nueva pantalla se listan todas las **planillas** (spreadsheets) disponibles para esa sucursal.
3. Seleccione la planilla desde la cual desea crear o actualizar una visita.

### 5.3. Manejar borradores existentes al elegir una planilla
- Si no hay visitas en curso para esa planilla:
  1. El sistema limpia cualquier progreso anterior.
  2. Descarga la información necesaria (ubicaciones, productos, trampas o plagas según corresponda).
  3. Lo lleva directamente al tablero de la visita para empezar a cargar datos.
- Si existe un borrador guardado para la misma planilla:
  1. Se muestra un aviso indicando que ya hay una visita pendiente.
  2. Elija **Crear una nueva** para descartar el borrador anterior y comenzar desde cero, o **Usar visita previa** para cargar el borrador existente.
  3. En ambos casos la aplicación prepara los datos maestros antes de abrir el tablero.

## 6. Creación y edición de visitas
### 6.1. Tablero de pasos
- El tablero muestra tarjetas para cada paso requerido u opcional. El color del ícono identifica la temática (fecha, trampas, firmas, etc.).
- Un badge verde con ✓ indica pasos completos; rojo con ✕ señala pendientes. En los pasos opcionales (Observaciones, Firma del Cliente, Documentos, Productos) el badge gris indica que no se cargó información adicional.
- Toque una tarjeta para abrir el paso correspondiente. La tarjeta **Confirmar** permite guardar la visita o el borrador según el estado de los demás pasos.

### 6.2. Reglas generales
- Los pasos obligatorios son: **Fecha**, **Documentos**, **Firma del Técnico** (salvo visitas existentes), **Número de Remito**, y al menos una captura o estado según el tipo de planilla (plagas o roedores).
- Los pasos opcionales agregan contexto pero no bloquean el guardado salvo que el tablero detecte datos incompletos al momento de confirmar.
- Puede guardar el progreso parcial como borrador desde el tablero (botón “Guardar borrador”) o desde el paso de Confirmación.

## 7. Descripción paso a paso del flujo de visitas
### 7.1. Fecha de visita
1. Ajuste la fecha y hora en el selector. Se muestran en formato de 24 horas.
2. Confirme con el botón **Guardar** para volver al tablero.
3. El encabezado del paso muestra la fecha seleccionada en texto legible.

### 7.2. Captura de plagas (planillas de tipo plaga)
1. Espere a que se carguen las ubicaciones y plagas; se organizan por sector.
2. Abra un sector para desplegar sus puntos de control.
3. Para cada ubicación registre la cantidad capturada por especie utilizando el campo numérico.
4. Repita en todos los sectores necesarios.
5. Pulse **Guardar** en el pie de pantalla para regresar al tablero.

### 7.3. Estado de trampas (planillas de tipo roedor)
1. Espere la carga de ubicaciones y estados de trampa.
2. Si desea aplicar el mismo estado a todas las ubicaciones utilice la opción **Marcar todas como** y elija el estado.
3. También puede establecer un mismo estado por sector mediante el selector que aparece dentro de cada acordeón.
4. Para ajustar un punto específico, abra la ubicación y seleccione el estado correspondiente en la lista.
5. Presione **Guardar** para volver al tablero.

### 7.4. Observaciones (opcional)
1. Ingrese comentarios generales sobre la visita en el cuadro de texto.
2. Seleccione **Guardar**. Además de almacenar la nota, la aplicación conserva un borrador automático de la visita.

### 7.5. Productos aplicados (opcional)
1. Pulse **Agregar Producto**.
2. Seleccione el producto de la lista (solo se muestran los que aún no se agregaron) y confirme.
3. Ingrese la dosis aplicada y confirme.
4. Introduzca el número de lote y confirme. El producto queda registrado con los tres datos.
5. Para eliminar un producto toque el ícono de papelera junto a su nombre.
6. Presione **Guardar** para regresar al tablero.

### 7.6. Documentos y evidencias
1. Use **Agregar Foto** para capturar una imagen relacionada con la visita o **Agregar Comprobante** para fotografiar el remito u otros documentos.
2. Al aceptar los permisos, la cámara del dispositivo se abrirá. Tome la foto y confirme.
3. La imagen se mostrará en la lista con miniatura. Puede eliminarla tocando la papelera.
4. Pulse **Guardar** para retornar al tablero.

### 7.7. Firma del técnico
1. Dibuje la firma en el recuadro con el dedo o un lápiz táctil.
2. Utilice **Limpiar Firma** si necesita empezar nuevamente.
3. Seleccione **Guardar** para almacenar la firma y volver al tablero.

### 7.8. Firma del cliente (opcional)
1. Solicite al cliente que firme en el recuadro mostrado.
2. Limpie y repita si fuese necesario.
3. Presione **Guardar** al finalizar.

### 7.9. Número de remito
1. Ingrese el número de remito en el campo provisto.
2. Solo se aceptan dígitos. Si el campo queda vacío o contiene caracteres no numéricos se mostrará un mensaje de error.
3. Corrija el dato y toque **Guardar**.

### 7.10. Confirmación final
1. Revise el mensaje: si aún faltan pasos obligatorios, se indicará cuántos restan.
2. Si faltan pasos y la visita es nueva puede usar **Guardar borrador** para almacenarla parcialmente y volver al inicio.
3. Cuando todos los pasos estén completos pulse **Guardar visita** (o **Guardar cambios** en visitas ya existentes). La aplicación intentará sincronizarla con el servidor.
4. Si la operación es exitosa, se mostrará un mensaje de confirmación y se volverá a Inicio. Si falla por falta de conexión, la visita se guardará como pendiente y quedará disponible en “Visitas offline”.

## 8. Gestión de borradores y sincronización offline
- **Guardar borrador manualmente**: desde el tablero, al pulsar la tarjeta de Confirmación se evaluará si faltan pasos y se ofrecerá guardar como borrador.
- **Guardado automático**: algunos pasos (por ejemplo Observaciones) invocan al guardado de borrador para asegurar que no se pierda la información.
- **Recuperar un borrador**: acceda a Inicio → “Visitas sin terminar”, elija la visita y presione **Continuar**.
- **Sincronizar visitas offline**: desde Inicio → “Visitas offline” puede reintentar individualmente o en bloque. Cada reintento vuelve a enviar la información al servidor.

## 9. Módulo Incidentes
### 9.1. Listado de incidentes
1. Ingrese a la pestaña **Incidentes**. La aplicación carga los incidentes asignados al técnico.
2. Cada fila muestra el número de incidente, la ubicación y el estado actual. El ícono al final identifica el estado: amarillo para **Pendiente**, naranja para **En Proceso**, verde para **Resuelto** y rojo para **Rechazado**.
3. Si no hay incidentes se mostrará un mensaje informativo.

### 9.2. Consultar el detalle de un incidente
1. Toque un incidente para abrir su detalle.
2. La pantalla muestra datos generales, observaciones registradas, imágenes adjuntas, productos y solución (si existen).
3. Utilice los encabezados plegables “Observaciones” e “Imágenes Adjuntas” para expandir o contraer la información. Puede abrir cada imagen en una nueva ventana tocándola.

### 9.3. Editar un incidente
1. Solo los incidentes en estado **Pendiente** o **En Proceso** permiten edición. En esos casos se muestra el botón **Editar Incidente**.
2. Pulse el botón para habilitar los campos editables. Podrá:
   - Cambiar el estado utilizando el selector superior.
   - Agregar un comentario adicional y opcionalmente adjuntar una foto.
   - Registrar productos utilizados y describir la solución si marcará el incidente como resuelto.
   - Indicar el motivo del rechazo si cambiará el estado a **Rechazado**.
3. Para adjuntar una foto use el botón **Agregar foto**. La aplicación solicitará permisos de cámara si aún no fueron otorgados.
4. Cuando termine, presione **Confirmar Cambios**. El botón solo se habilita si:
   - Se agregó un comentario o una foto nueva, o
   - Se cambió el estado respecto del original.
5. Cumpla con las validaciones específicas:
   - Estado **Resuelto**: es obligatorio describir la solución y se recomienda detallar productos utilizados. También puede adjuntar foto.
   - Estado **Rechazado**: el motivo debe tener al menos 10 caracteres.
6. Tras confirmar, la aplicación guarda los cambios y actualiza la vista. Si ocurre un error, se mostrará un mensaje y se recargará la información para mantener la consistencia.
7. Para cancelar la edición sin guardar, use el botón **Cancelar**.

### 9.4. Agregar comentarios sin cambiar el estado
- Durante la edición, si mantiene el mismo estado debe escribir un comentario o adjuntar al menos una foto para habilitar **Confirmar Cambios**. Esto asegura que cada acción quede registrada.

### 9.5. Volver al listado
- Utilice el botón **Volver** para regresar al listado de incidentes en cualquier momento.

## 10. Perfil del usuario
1. Abra la pestaña **Perfil**.
2. Toque el enlace **Cerrar sesión** para eliminar el token almacenado y regresar a la pantalla de inicio de sesión.
3. Use esta opción cuando termine su jornada o necesite cambiar de usuario.

## 11. Mensajes y ayudas visuales
- **Loader global**: un fondo semitransparente con un spinner negro indica que el sistema está procesando una operación; espere a que desaparezca antes de continuar.
- **Alertas**: al guardar visitas o incidentes se presentan diálogos informativos indicando éxito o errores. Lea el mensaje y confirme para continuar.
- **Etiquetas de entorno**: en la pantalla de login verá el ambiente activo para validar si está trabajando contra producción o contra un entorno de pruebas.
- **Indicadores de estado**: los iconos de colores en Inicio e Incidentes ayudan a identificar rápidamente si una visita está sincronizada o si un incidente requiere atención.

## 12. Buenas prácticas recomendadas
- Sincronice los datos siempre que disponga de conexión estable para evitar acumular visitas offline.
- Revise el tablero antes de confirmar una visita para asegurarse de que los pasos obligatorios estén completos.
- Solicite al cliente y al supervisor que verifiquen las firmas y la documentación antes de abandonar el sitio.
- Mantenga el dispositivo con suficiente batería y espacio libre para tomar fotos.
- Cierre sesión si comparte el dispositivo con otros técnicos.
