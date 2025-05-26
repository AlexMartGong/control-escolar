<?php
class AlumnoDAO
{
    private $conector;

    /**
     * Constructor de la clase AlumnoDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }


    /**
     * Registra un nuevo alumno en la base de datos.
     * 
     * Este método valida los datos recibidos para asegurar que cumplan con
     * los requisitos establecidos, como formato, longitud y valores válidos.
     * 
     * Si todas las validaciones son exitosas, se verifica que:
     * - La carrera asociada exista y esté activa.
     * - No exista un alumno duplicado con el mismo número de control.
     * 
     * Luego, se ejecuta el procedimiento almacenado `spAgregarAlumno` 
     * para insertar el nuevo registro en la base de datos.
     * 
     * Finalmente, interpreta el mensaje de salida del SP y retorna
     * una respuesta adecuada para mostrar al usuario.
     *
     * @param object $datos Objeto con las siguientes propiedades:
     *     - pnoControl: Número de control del alumno (hasta 10 caracteres, puede comenzar con 'C' seguido de números).
     *     - pnombre: Nombre completo del alumno (solo letras y espacios, máx. 50 caracteres).
     *     - pgenero: Género del alumno ("Masculino" o "Femenino").
     *     - psemestre: Semestre actual (entero mayor o igual a 1).
     *     - pgrupo: Letra del grupo asignado (A, B, C, D o U).
     *     - pturno: Turno escolar ("Matutino" o "Vespertino").
     *     - pclaveCarrera: Clave de la carrera asociada.
     *     - periodosEnBaja: Número de periodos en baja (entre 0 y 3).
     *     - estado: Estado actual del alumno (debe ser "Activo").
     * 
     * @return array Retorna un array asociativo con:
     *     - 'estado': 'OK' si fue exitoso, 'Error' si hubo algún problema.
     *     - 'mensaje': Descripción legible del resultado de la operación.
     */
    public function AgregarAlumno($datos)
    {
        // Inicializa el resultado con estado de error por defecto
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // -----------------------------------------
        // Validaciones
        // -----------------------------------------

        // Validar que los campos no esten vacios
        if (
            empty($datos->pnoControl) ||
            empty($datos->pnombre) ||
            empty($datos->pgenero) ||
            empty($datos->psemestre) ||
            empty($datos->pgrupo) ||
            empty($datos->pturno) ||
            empty($datos->pclaveCarrera)
        ) {
            $resultado['mensaje'] = "Todos los campos son obligatorios. Por favor, complete la información para registrar al alumno.";
            return $resultado;
        }

        // Validar que el nombre solo contenga letras y espacios, y no exceda los 50 caracteres
        if (
            empty($datos->pnoControl) ||
            strlen($datos->pnoControl) > 10 ||
            !preg_match('/^C?[0-9]{1,9}$/', $datos->pnoControl)
        ) {
            $resultado['mensaje'] = "El número de control debe tener un máximo de 10 caracteres, puede comenzar con 'C' y contener solo números después.";
            return $resultado;
        }

        // Validar que el nombre solo contenga letras y espacios, y no exceda los 50 caracteres
        if (empty($datos->pnombre) || !preg_match('/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{1,50}$/u', $datos->pnombre)) {
            $resultado['mensaje'] = "El nombre solo puede contener letras y espacios, y debe tener como máximo 50 caracteres.";
            return $resultado;
        }

        // Validar que el género sea únicamente “Masculino” o “Femenino”
        if ($datos->pgenero !== "Masculino" && $datos->pgenero !== "Femenino") {
            $resultado['mensaje'] = "Seleccione un género válido: 'Masculino' o 'Femenino'.";
            return $resultado;
        }

        // Validar que el semestre sea un número mayor o igual a 1
        if (!is_numeric($datos->psemestre) || $datos->psemestre < 1) {
            $resultado['mensaje'] = "El semestre debe ser un número mayor o igual a 1.";
            return $resultado;
        }

        // Validar que el grupo sea una sola letra: A, B, C, D o U
        if (!preg_match('/^[ABCDU]$/', $datos->pgrupo)) {
            $resultado['mensaje'] = "El grupo debe ser una sola letra: A, B, C, D o U.";
            return $resultado;
        }

        // Validar que el turno sea únicamente “Matutino” o “Vespertino”
        if ($datos->pturno !== "Matutino" && $datos->pturno !== "Vespertino") {
            $resultado['mensaje'] = "El turno debe ser 'Matutino' o 'Vespertino'.";
            return $resultado;
        }

        // Verificar si la carrera existe y se encuentra activa
        $sp = $c->prepare("CALL spBuscarCarreraByID(:pid, @mensaje)");
        $sp->bindParam(':pid', $pclaveCarrera, PDO::PARAM_STR);
        $sp->execute();

        $carrera = $sp->fetch(PDO::FETCH_ASSOC);
        $sp->closeCursor();

        $respuestaSP = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        if ($mensaje['@mensaje'] === 'Error: No existen registros con el parámetro solicitado') {
            $resultado['mensaje'] = "La carrera seleccionada no existe. Verifique la clave ingresada.";
            return $resultado;
        }

        if ($mensaje['@mensaje'] === 'Estado: Exito' && $carrera['estado'] !== 'Activo') {
            $resultado['mensaje'] = "La carrera existe pero no está activa. Solo se pueden registrar alumnos en carreras activas.";
            return $resultado;
        }

        // Verificar si ya existe un alumno con el mismo número de control
        $sp = $c->prepare("CALL spBuscarAlumnoDuplicadoID(:pid, @mensaje)");
        $sp->bindParam(':pid', $datos->pnoControl, PDO::PARAM_STR);
        $sp->execute();

        $sp->closeCursor();

        $respuestaSP = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        if ($mensaje['@mensaje'] === 'Estado: Existe') {
            $resultado['mensaje'] = "Ya hay un alumno registrado con ese número de control. Verifique que no se trate de un duplicado.";
            return $resultado;
        }

        // -----------------------------------------
        // Llamada al sp para hacer la funcionalidad
        // -----------------------------------------

        try {
            // Registrar en log el intento de ejecución del SP para trazabilidad
            error_log("Ejecutando SP para agregar un Alumno con: " . json_encode($datos));

            // Preparar llamada al procedimiento almacenado con parámetros
            $sp = $c->prepare("CALL spAgregarAlumno(:pnoControl, :pnombre, :pgenero, :psemestre, :pgrupo, :pturno, :pclaveCarrera, @mensaje)");
            $sp->bindParam(':pnoControl', $datos->pnoControl, PDO::PARAM_STR);
            $sp->bindParam(':pnombre', $datos->pnombre, PDO::PARAM_STR);
            $sp->bindParam(':pgenero', $datos->pgenero, PDO::PARAM_STR);
            $sp->bindParam(':psemestre', $datos->psemestre, PDO::PARAM_INT);
            $sp->bindParam(':pgrupo', $datos->pgrupo, PDO::PARAM_STR);
            $sp->bindParam(':pturno', $datos->pturno, PDO::PARAM_STR);
            $sp->bindParam(':pclaveCarrera', $datos->pclaveCarrera, PDO::PARAM_STR);

            $sp->execute();
            $sp->closeCursor(); // Cierra el cursor para liberar recursos antes de ejecutar otra consulta

            // Recuperar el mensaje generado por el procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Interpretar el mensaje del SP y preparar la respuesta al usuario
            switch ($resultado['respuestaSP']) {

                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['mensaje'] = "El alumno fue registrado exitosamente en el sistema.";
                    break;

                case 'Error: No se pudo agregar el registro':
                    $resultado['mensaje'] = "Ocurrió un error y no se pudo registrar el alumno. Por favor, intenta nuevamente más tarde.";
                    break;

                default:

                    $resultado['mensaje'] = "Ocurrió un error inesperado. Contacta al administrador si el problema persiste.";
                    break;
            }
        } catch (PDOException $e) {

            error_log("Error en la base de datos: " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al agregar el alumno. Por favor, intente nuevamente más tarde.";
        }

        // Devolver resultado final con estado y mensaje
        return $resultado;
    }

    /**
     * Busca un alumno en la base de datos utilizando su número de control.
     * 
     * Este método invoca el procedimiento almacenado `spBuscarAlumnoByID` para
     * obtener los datos del alumno correspondiente al número de control proporcionado.
     * 
     * @param string $id Número de control del alumno a buscar.
     * 
     * @return array Devuelve un arreglo asociativo con las claves:
     *   - 'estado': Indica el resultado de la operación ('OK' si se encontró el alumno, 'Error' en caso contrario).
     *   - 'mensaje': Mensaje descriptivo en caso de error o información adicional.
     *   - 'datos' (opcional): Datos del alumno recuperados si la búsqueda fue exitosa.
     *   - 'respuestaSP' (opcional): Mensaje retornado por el procedimiento almacenado.
     */
    public function BuscarAlumno($id)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que el NC no esté vacío
        if (empty($id)) {
            $resultado['mensaje'] = "Ocurrió un problema interno al procesar la solicitud. Inténtelo nuevamente más tarde.";
            error_log("No llego el nc correctamente: " . $id);
            return $resultado;
        }

        try {
            // Ejecutar procedimiento almacenado con parámetro de entrada y salida
            $sp = $c->prepare("CALL spBuscarAlumnoByID(:pid, @mensaje)");
            $sp->bindParam(':pid', $id, PDO::PARAM_STR);
            $sp->execute();

            // Obtener datos devueltos por el SELECT del procedimiento
            $datos = $sp->fetch(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar recursos del cursor

            // Consultar el mensaje de salida del procedimiento
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Evaluar mensaje de salida usando switch
            switch ($resultado['respuestaSP']) {

                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['datos'] = $datos;
                    break;

                default:
                    $resultado['mensaje'] = "Algo salió mal al intentar obtener la información de la oferta. Por favor, vuelva a intentarlo más tarde.";
                    break;
            }
        } catch (PDOException $e) {
            // Registrar errores de la base de datos
            error_log("Error en la BD al traer los datos del alumno: " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al acceder a la información. Por favor, intente nuevamente más tarde.";
        }

        return $resultado;
    }

    /**
     * Modifica los datos de un alumno en la base de datos.
     * 
     * Este método valida los datos recibidos y llama al procedimiento almacenado
     * `spModificarAlumno` para actualizar un registro de alumno existente con los nuevos datos proporcionados.
     * También verifica que la información ingresada no sea idéntica a la ya registrada para evitar actualizaciones innecesarias.
     * 
     * @param string $pnoControl    Número de control del alumno (máximo 10 caracteres, puede iniciar con 'C' seguido de números).
     * @param string $pnombre       Nombre completo del alumno (solo letras y espacios, máximo 50 caracteres).
     * @param string $pgenero       Género del alumno ('Masculino' o 'Femenino').
     * @param int    $psemestre     Semestre actual del alumno (número entero mayor o igual a 1).
     * @param string $pgrupo        Grupo del alumno (una letra entre 'A', 'B', 'C', 'D' o 'U').
     * @param string $pturno        Turno del alumno ('Matutino' o 'Vespertino').
     * @param string $pclaveCarrera Clave de la carrera asociada al alumno.
     * 
     * @return array Arreglo asociativo con las siguientes claves:
     *   - 'estado': 'OK' si la modificación fue exitosa, 'Error' en caso contrario.
     *   - 'mensaje': Descripción del resultado o del error ocurrido.
     *   - 'respuestaSP': Mensaje retornado por el procedimiento almacenado (útil para depuración).
     */
    public function ModificarAlumno($pnoControl, $pnombre, $pgenero, $psemestre, $pgrupo, $pturno, $pclaveCarrera)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // -----------------------------------------
        // Validaciones
        // -----------------------------------------

        // Validar que los campos no estén vacíos
        if (
            empty($pnoControl) ||
            empty($pnombre) ||
            empty($pgenero) ||
            empty($psemestre) ||
            empty($pgrupo) ||
            empty($pturno) ||
            empty($pclaveCarrera)
        ) {
            $resultado['mensaje'] = "Todos los campos son obligatorios. Por favor, complete la información para registrar al alumno.";
            return $resultado;
        }

        // Validar que el número de control tenga máximo 10 caracteres, comience opcionalmente con 'C' y el resto números
        if (
            strlen($pnoControl) > 10 ||
            !preg_match('/^C?[0-9]{1,9}$/', $pnoControl)
        ) {
            $resultado['mensaje'] = "El número de control debe tener un máximo de 10 caracteres, puede comenzar con 'C' y contener solo números después.";
            return $resultado;
        }

        // Validar que el nombre solo contenga letras y espacios, y tenga máximo 50 caracteres
        if (!preg_match('/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{1,50}$/u', $pnombre)) {
            $resultado['mensaje'] = "El nombre solo puede contener letras y espacios, y debe tener como máximo 50 caracteres.";
            return $resultado;
        }

        // Validar que el género sea únicamente “Masculino” o “Femenino”
        if ($pgenero !== "Masculino" && $pgenero !== "Femenino") {
            $resultado['mensaje'] = "Seleccione un género válido: 'Masculino' o 'Femenino'.";
            return $resultado;
        }

        // Validar que el semestre sea un número mayor o igual a 1
        if (!is_numeric($psemestre) || $psemestre < 1) {
            $resultado['mensaje'] = "El semestre debe ser un número mayor o igual a 1.";
            return $resultado;
        }

        // Validar grupo (A, B, C, D o U)
        if (!preg_match('/^[ABCDU]$/', $pgrupo)) {
            $resultado['mensaje'] = "El grupo debe ser una sola letra: A, B, C, D o U.";
            return $resultado;
        }

        // Validar que el turno sea únicamente “Matutino” o “Vespertino”
        if ($pturno !== "Matutino" && $pturno !== "Vespertino") {
            $resultado['mensaje'] = "El turno debe ser 'Matutino' o 'Vespertino'.";
            return $resultado;
        }

        // Validar existencia y estado de la carrera
        $sp = $c->prepare("CALL spBuscarCarreraByID(:pid, @mensaje)");
        $sp->bindParam(':pid', $pclaveCarrera, PDO::PARAM_STR);
        $sp->execute();

        $carrera = $sp->fetch(PDO::FETCH_ASSOC);
        $sp->closeCursor();

        $respuestaSP = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        if ($mensaje['@mensaje'] === 'Error: No existen registros con el parámetro solicitado') {
            $resultado['mensaje'] = "La carrera seleccionada no existe. Verifique la clave ingresada.";
            return $resultado;
        }

        if ($mensaje['@mensaje'] === 'Estado: Exito' && $carrera['estado'] !== 'Activo') {
            $resultado['mensaje'] = "La carrera existe pero no está activa. Solo se pueden registrar alumnos en carreras activas.";
            return $resultado;
        }

        // Validar existencia del alumno por noControl
        $sp = $c->prepare("CALL spBuscarAlumnoDuplicadoID(:pid, @mensaje)");
        $sp->bindParam(':pid', $pnoControl, PDO::PARAM_STR);
        $sp->execute();
        $sp->closeCursor();

        $respuestaSP = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        if ($mensaje['@mensaje'] === 'Estado: No Existe') {
            $resultado['mensaje'] = "El alumno ingresado no existe. Por favor contacta al administrador para más información.";
            return $resultado;
        }

        // Verificar si los datos del alumno son iguales a los actuales
        $sp = $c->prepare("CALL spBuscarAlumnoByID(:pid, @mensaje)");
        $sp->bindParam(':pid', $pnoControl, PDO::PARAM_STR);
        $sp->execute();
        $alumnoActual = $sp->fetch(PDO::FETCH_ASSOC);
        $sp->closeCursor();

        $respuestaSP = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        if (
            $mensaje['@mensaje'] === 'Estado: Exito' &&
            $alumnoActual &&
            $alumnoActual['numero_de_control'] == $pnoControl &&
            $alumnoActual['nombre_de_alumno'] == $pnombre &&
            $alumnoActual['genero'] == $pgenero &&
            $alumnoActual['semestre'] == $psemestre &&
            $alumnoActual['grupo'] == $pgrupo &&
            $alumnoActual['turno'] == $pturno &&
            $alumnoActual['clave_de_carrera'] == $pclaveCarrera
        ) {
            $resultado['mensaje'] = "No se realizaron cambios porque la información ingresada es idéntica a la ya registrada para este alumno.";
            return $resultado;
        }

        // -----------------------------------------
        // Llamada al sp para hacer la funcionalidad
        // -----------------------------------------

        try {

            // Preparar y ejecutar el procedimiento almacenado
            $sp = $c->prepare("CALL spModificarAlumno(:pnoControl, :pnombre, :pgenero, :psemestre, :pgrupo, :pturno, :pclaveCarrera, @mensaje)");
            $sp->bindParam(':pnoControl', $pnoControl, PDO::PARAM_STR);
            $sp->bindParam(':pnombre', $pnombre, PDO::PARAM_STR);
            $sp->bindParam(':pgenero', $pgenero, PDO::PARAM_STR);
            $sp->bindParam(':psemestre', $psemestre, PDO::PARAM_INT);
            $sp->bindParam(':pgrupo', $pgrupo, PDO::PARAM_STR);
            $sp->bindParam(':pturno', $pturno, PDO::PARAM_STR);
            $sp->bindParam(':pclaveCarrera', $pclaveCarrera, PDO::PARAM_STR);
            $sp->execute();
            $sp->closeCursor();

            // Recuperar el mensaje devuelto por el procedimiento
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Interpretar el mensaje del SP y generar una respuesta adecuada
            switch ($resultado['respuestaSP']) {

                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['mensaje'] = "La información del alumno se actualizó correctamente.";
                    break;

                case 'Error: No se pudo modificar el registro':
                    $resultado['mensaje'] = "No fue posible guardar los cambios del alumno seleccionado. Por favor, verifique la información o intente nuevamente más tarde.";
                    break;

                default:
                    $resultado['mensaje'] = "Ocurrió un error inesperado al actualizar el alumno. Si el problema continúa, contacte al personal encargado.";
                    break;
            }
        } catch (PDOException $e) {
            // Registrar el error internamente
            error_log("Error en la base de datos al modificar alumno: " . $e->getMessage());
            error_log("Detalles del error: " . $e->getTraceAsString());

            // Mensaje para el usuario final
            $resultado['mensaje'] = "No se pudo completar la modificación por un problema interno. Intente nuevamente más tarde.";
        }

        return $resultado;
    }

    /**
     * Función para mostrar todos los alumnos registradas en el sistema.
     * Llama al procedimiento almacenado spMostrarAlumno.
     * 
     * @return array Retorna un array con el estado de la operación, mensaje, datos y cantidad de filas obtenidas.
     */
    public function MostrarAlumno()
    {
        // Inicializar estado como OK por defecto
        $resultado['estado'] = "OK";
        $c = $this->conector;

        try {
            // Preparar y ejecutar el procedimiento almacenado
            $sp = $c->prepare("CALL spMostrarAlumno(@mensaje)");
            $sp->execute();

            // Obtener todos los datos retornados
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar resultado para permitir obtener @mensaje

            // Consultar el mensaje de salida del procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log para depuración
            error_log("Mensaje spAlumno: " . $resultado['respuestaSP']);

            // Verificar si el procedimiento fue exitoso
            if ($resultado['respuestaSP'] == 'Estado: Exito') {
                $resultado['datos'] = $datos;              // Asignar datos recuperados
                $resultado['filas'] = count($datos);       // Contar registros obtenidos
            } else {
                $resultado['filas'] = 0;
                $resultado['estado'] = "Sin registros de alumno para mostrar";
            }
        } catch (PDOException $e) {
            // Manejo de excepciones por errores en la base de datos
            $resultado['estado'] = "Error Mostrar alumno: " . $e->getMessage();
        }

        return $resultado;
    }

    // Funcion para cambiar el estado de alumno con el sp spModificarEstadoAlumno
    public function CambiarEstadoAlumno($datos)
    {
        // Inicializa el resultado con estado de error por defecto
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que el estado sea un valor aceptado
        if (empty($datos->pclave) || empty($datos->pestado)) {
            $resultado['mensaje'] = "Por favor, proporcione todos los campos requeridos: clave del alumno y estado del alumno";
            return $resultado;
        }

        // Validar que el estado sea un valor aceptado
        if ($datos->pestado !== "Activo" && $datos->pestado !== "Baja" & $datos->pestado !== "Baja Temporal" & $datos->pestado !== "Baja Definitiva") {
            $resultado['mensaje'] = "El estado ingresado no es válido. Solo se permite 'Activo', 'Baja', 'Baja Temporal' o 'Baja Definitiva'.";
            return $resultado;
        }

        // Validacion doble
        $sp = $c->prepare("CALL spBuscarAlumnoByID(:pid, @mensaje)");
        $sp->bindParam(':pid', $datos->pclave, PDO::PARAM_INT);
        $sp->execute();

        // Obtener la fila del resultado
        $oferta = $sp->fetch(PDO::FETCH_ASSOC);
        $sp->closeCursor();

        // Obtener el mensaje del SP
        $respuestaSPV = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSPV->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        // Verificar si el estado ingresado es igual al actual
        if ($mensaje['@mensaje'] === 'Estado: Exito' && $oferta['estado'] === $datos->pestado) {
            $resultado['mensaje'] = "No se realizó ningún cambio porque el estado ingresado es igual al actual.";
            return $resultado;
        }

        // Verificar si ya existe un alumno con la misma clave (por ejemplo, al insertar)
        if ($mensaje['@mensaje'] === 'Error: No existen registros con el parámetro solicitado') {
            $resultado['mensaje'] = "El registro de alumno que se esta intentando modificar no existe, por favor intente con otro.";
            return $resultado;
        }


        try {
            // Registrar en log el intento de ejecución del SP para trazabilidad
            error_log("Ejecutando SP para modificar el estado del alumno con ID: $datos->pclave y Estado: $datos->pestado");

            // Preparar llamada al procedimiento almacenado con parámetros
            $sp = $c->prepare("CALL spModificarEstadoAlumno(:pclave, :pestado, @mensaje)");
            $sp->bindParam(':pclave', $datos->pclave, PDO::PARAM_INT);
            $sp->bindParam(':pestado', $datos->pestado, PDO::PARAM_STR);
            $sp->execute();
            $sp->closeCursor(); // Cierra el cursor para liberar recursos antes de ejecutar otra consulta

            // Recuperar el mensaje generado por el procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log el mensaje devuelto por el SP
            error_log("Mensaje spModificarEstadoAlumno: " . $resultado['respuestaSP']);

            // Interpretar el mensaje del SP y preparar la respuesta al usuario
            switch ($resultado['respuestaSP']) {

                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['mensaje'] = "El estado del registro fue actualizado exitosamente.";
                    break;

                case 'Error: No se pudo modificar el registro':
                    $resultado['mensaje'] = "No fue posible el cambio de estado del alumno. Por favor, intente nuevamente más tarde.";
                    break;

                default:
                    // Manejo de errores desconocidos devueltos por el SP
                    $resultado['mensaje'] = "Ocurrió un error inesperado. Contacte al administrador si el problema persiste.";
                    break;
            }
        } catch (PDOException $e) {
            // Registro detallado de errores para depuración en caso de excepción
            error_log("Error en la base de datos: " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al cambiar el estado de la Oferta. Por favor, intente nuevamente más tarde.";
        }

        // Devolver resultado final con estado y mensaje
        return $resultado;
    }
}
    
