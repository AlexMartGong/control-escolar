<?php

class HorarioDAO
{

    private $conector;

    /**
     * Constructor de la clase HorarioDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

    /**
     * Busca el periodo que este entre el rango de fechas valido para modificar horarios.
     *
     * Este método ejecuta el procedimiento almacenado `spBuscarPeriodoValido`
     * que devuelve los periodos cuyo estado coincide con el parámetro recibido.
     * Valida que el parámetro no esté vacío antes de realizar la consulta y maneja
     * errores de base de datos con mensajes adecuados.
     *
     * @param string $pestado Estado del periodo a buscar (por ejemplo: 'Abierto', 'Pendiente').
     *
     * @return array Arreglo con los periodos encontrados o un arreglo con 'estado' => 'Error' y mensaje.
     */
    public function BuscarPeriodoValido()
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        try {
            // Preparar y ejecutar el procedimiento almacenado con el parámetro estado
            $sp = $c->prepare("CALL spBuscarPeriodoValido(@mensaje)");
            $sp->execute();

            // Obtener todos los registros devueltos por el procedimiento
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            
            $resultado['datos'] = $datos;

        } catch (PDOException $e) {
            // Registrar el error para fines de depuración interna
            error_log("Error en la base de datos (BuscarPeriodoValido): " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al acceder a la información. Por favor, intente nuevamente más tarde.";
        }

        return $resultado;
    }

    /**
     * Agrega un horario grupal para una carrera y semestre específicos.
     *
     * Este método valida los datos recibidos y luego llama al procedimiento almacenado
     * `spAgregarHorarioGrupal` para registrar un nuevo horario grupal en la base de datos.
     * Antes de guardar, verifica que la carrera especificada exista y esté activa.
     *
     * @param string $pclvCarrera Clave de la carrera en formato 'AAAA-0000-000'.
     * @param int    $psemestre   Número de semestre (de 1 a 12).
     * @param string $pgrupo      Letra que representa el grupo (una sola letra).
     * @param string $pturno      Turno en el que se imparte ('Matutino' o 'Vespertino').
     *
     * @return array Arreglo asociativo con las siguientes claves:
     *   - 'estado': 'OK' si el guardado fue exitoso, 'Error' si ocurrió un problema.
     *   - 'mensaje': Texto explicativo del resultado o error.
     *   - 'respuestaSP': Respuesta directa del procedimiento almacenado.
     */
    public function AgregarHorarioGrupal($pclvCarrera, $psemestre, $pgrupo, $pturno)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // ------------------------
        // Validaciones
        // ------------------------

        // Verifica que ningún campo esté vacío
        if (empty($pclvCarrera) || empty($psemestre) || empty($pgrupo) || empty($pturno)) {
            $resultado['mensaje'] = "Por favor, complete todos los campos obligatorios para continuar.";
            return $resultado;
        }

        // Verifica que el semestre esté entre 1 y 12
        if (!filter_var($psemestre, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1, "max_range" => 12]])) {
            $resultado['mensaje'] = "El semestre debe ser un número entre 1 y 12.";
            return $resultado;
        }

        // Verifica que el grupo sea una sola letra
        if (!preg_match('/^[A-Za-z]$/', $pgrupo)) {
            $resultado['mensaje'] = "El grupo debe ser una sola letra (por ejemplo: A, B, C).";
            return $resultado;
        }

        // Verifica que el turno sea válido
        if ($pturno !== "Matutino" && $pturno !== "Vespertino") {
            $resultado['mensaje'] = "El turno debe ser 'Matutino' o 'Vespertino'.";
            return $resultado;
        }

        // Verifica que la clave de carrera tenga el formato correcto
        if (!preg_match('/^[A-Za-z]{4}-\d{4}-\d{3}$/', $pclvCarrera)) {
            $resultado['mensaje'] = "La clave de la carrera debe tener este formato: IINF-2010-220 (4 letras, guion, 4 dígitos, guion, 3 dígitos).";
            return $resultado;
        }

        // ------------------------
        // Verificación de la carrera
        // ------------------------

        $sp = $c->prepare("CALL spBuscarCarreraByID(:pid, @mensaje)");
        $sp->bindParam(':pid', $pclvCarrera, PDO::PARAM_STR);
        $sp->execute();

        $carrera = $sp->fetch(PDO::FETCH_ASSOC);
        $sp->closeCursor();

        $respuestaSP = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        // Verifica si la carrera no existe
        if ($mensaje['@mensaje'] === 'Error: No existen registros con el parámetro solicitado') {
            $resultado['mensaje'] = "La carrera ingresada no existe.";
            return $resultado;
        }

        // Verifica si la carrera no está activa
        if ($mensaje['@mensaje'] === 'Estado: Exito' && $carrera['estado'] !== 'Activo') {
            $resultado['mensaje'] = "La carrera debe estar en estado 'Activo' para realizar esta operación.";
            return $resultado;
        }

        // ------------------------
        // Verificación del periodo
        // ------------------------

        $sp = $c->prepare("CALL spBuscarPeriodoValido(@mensaje)");
        $sp->execute();
        $sp->closeCursor();
        
        $respuestaSP = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        // Verifica existe un periodo abierto o pendiente y que coincida con las fechas actuales
        if ($mensaje['@mensaje'] === 'Estado: No valido') {
            $resultado['mensaje'] = "No es posible realizar ajustes en los horarios porque no existe ningún periodo con estado Abierto o Pendiente que esté vigente en las fechas actuales.";
            return $resultado;
        }

        // ------------------------
        // Verificación Combinacion de Alumnos
        // ------------------------

        $sp = $c->prepare("CALL spExistenAlumnosByCarreraSemestreGrupoTurno(:pclavecarrera, :psemestre, :pgrupo, :pturno, @mensaje)");
        $sp->bindParam(':pclavecarrera', $pclvCarrera, PDO::PARAM_STR);
        $sp->bindParam(':psemestre', $psemestre, PDO::PARAM_INT);
        $sp->bindParam(':pgrupo', $pgrupo, PDO::PARAM_STR);
        $sp->bindParam(':pturno', $pturno, PDO::PARAM_STR);
        $sp->execute();
        $sp->closeCursor();

        $respuestaSP = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        // Verifica si existen alumnos para la combinacion seleccionada
        if ($mensaje['@mensaje'] === 'Estado: No existen') {
            $resultado['mensaje'] = "No se encontraron alumnos activos para la combinación de carrera, semestre, grupo y turno seleccionados.";
            return $resultado;
        }

        // ------------------------
        // Verificación Combinacion de Ofertas
        // ------------------------

        $sp = $c->prepare("CALL spExistenOfertasByCarreraSemestreGrupoTurno(:pclavecarrera, :psemestre, :pgrupo, :pturno, @mensaje)");
        $sp->bindParam(':pclavecarrera', $pclvCarrera, PDO::PARAM_STR);
        $sp->bindParam(':psemestre', $psemestre, PDO::PARAM_INT);
        $sp->bindParam(':pgrupo', $pgrupo, PDO::PARAM_STR);
        $sp->bindParam(':pturno', $pturno, PDO::PARAM_STR);
        $sp->execute();
        $sp->closeCursor();

        $respuestaSP = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        // Verifica si existen alumnos para la combinacion seleccionada
        if ($mensaje['@mensaje'] === 'Estado: No existen') {
            $resultado['mensaje'] = "No se encontraron ofertas académicas disponibles para la combinación de carrera, semestre, grupo y turno seleccionados.";
            return $resultado;
        }

        // ------------------------
        // Inserción del horario grupal
        // ------------------------

        try {
            // Llama al SP para registrar el horario grupal
            $sp = $c->prepare("CALL spAgregarHorarioGrupal(:pclavecarrera, :psemestre, :pgrupo, :pturno, @mensaje)");
            $sp->bindParam(':pclavecarrera', $pclvCarrera, PDO::PARAM_STR);
            $sp->bindParam(':psemestre', $psemestre, PDO::PARAM_INT);
            $sp->bindParam(':pgrupo', $pgrupo, PDO::PARAM_STR);
            $sp->bindParam(':pturno', $pturno, PDO::PARAM_STR);

            $sp->execute();
            $sp->closeCursor();

            // Recupera la respuesta del SP
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Interpreta la respuesta del SP
            switch ($resultado['respuestaSP']) {
                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['mensaje'] = "La información de los horarios se guardó exitosamente.";
                    break;

                case 'Error: No se pudieron agregar los registros':
                    $resultado['mensaje'] = "No fue posible guardar la información del los horarios. Verifique los datos o intente más tarde.";
                    break;

                default:
                    $resultado['mensaje'] = "Ocurrió un error inesperado al guardar los horarios. Si el problema persiste, contacte al administrador del sistema.";
                    break;
            }
        } catch (PDOException $e) {
            // Log interno del error
            error_log("Error en la base de datos al guardar los horarios: " . $e->getMessage());
            error_log("Detalles del error: " . $e->getTraceAsString());

            // Mensaje amigable al usuario
            $resultado['mensaje'] = "No se pudo completar el guardado del horario debido a un problema interno. Intente más tarde.";
        }

        return $resultado;
    }

    /**
     * Busca y obtiene la lista de alumnos activos según carrera, semestre, grupo y turno.
     *
     * Este método ejecuta el procedimiento almacenado `spBuscarAlumnosByCarreraSemestreGrupoTurno`
     * que devuelve los alumnos que coinciden con los parámetros indicados y un mensaje con el estado
     * de la consulta. Maneja excepciones para errores en la base de datos y valida que los parámetros
     * no estén vacíos antes de hacer la consulta.
     *
     * @param string $pclvCarrera Clave de la carrera en formato válido (ejemplo: 'IINF-2010-220').
     * @param int    $psemestre   Número de semestre (1 a 12).
     * @param string $pgrupo      Letra que representa el grupo.
     * @param string $pturno      Turno correspondiente ('Matutino' o 'Vespertino').
     *
     * @return array Arreglo asociativo con las siguientes claves:
     *   - 'estado': 'OK' si la consulta fue exitosa, 'Error' si hubo un problema.
     *   - 'datos': arreglo con los registros de alumnos (si se encontraron).
     *   - 'mensaje': texto explicativo en caso de error o información adicional.
     *   - 'respuestaSP': mensaje devuelto por el procedimiento almacenado.
     */
    public function BuscarAlumnosHorarios($pclvCarrera, $psemestre, $pgrupo, $pturno)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que los parámetros no estén vacíos o nulos
        if (empty($pclvCarrera) || empty($psemestre) || empty($pgrupo) || empty($pturno)) {
            $resultado['mensaje'] = "Ocurrió un problema interno al procesar la solicitud. Inténtelo nuevamente más tarde.";
            return $resultado;
        }

        try {
            // Preparar y ejecutar el procedimiento almacenado con los parámetros indicados
            $sp = $c->prepare("CALL spBuscarAlumnosByCarreraSemestreGrupoTurno(:pclavecarrera, :psemestre, :pgrupo, :pturno, @mensaje)");
            $sp->bindParam(':pclavecarrera', $pclvCarrera, PDO::PARAM_STR);
            $sp->bindParam(':psemestre', $psemestre, PDO::PARAM_INT);
            $sp->bindParam(':pgrupo', $pgrupo, PDO::PARAM_STR);
            $sp->bindParam(':pturno', $pturno, PDO::PARAM_STR);

            $sp->execute();

            // Obtener todos los registros devueltos por el procedimiento
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar el cursor para la siguiente consulta

            // Consultar el mensaje de salida del procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Evaluar el mensaje y preparar la respuesta según el resultado
            switch ($resultado['respuestaSP']) {
                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['datos'] = $datos;
                    break;

                case 'Estado: No se encontraron registros':
                    $resultado['mensaje'] = "No se encontraron alumnos con la combinación seleccionada.";
                    break;

                default:
                    $resultado['mensaje'] = "Error inesperado al obtener la información de los alumnos. Inténtelo nuevamente más tarde.";
                    break;
            }
        } catch (PDOException $e) {
            // Registrar el error para depuración interna
            error_log("Error en la base de datos (BuscarAlumnosHorarios): " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al acceder a la información. Por favor, intente nuevamente más tarde.";
        }

        return $resultado;
    }

    /**
     * Busca y obtiene la lista de ofertas académicas según carrera, semestre, grupo y turno.
     *
     * Este método ejecuta el procedimiento almacenado `spBuscarOfertasByCarreraSemestreGrupoTurno`
     * que devuelve las ofertas que coinciden con los parámetros indicados y un mensaje con el estado
     * de la consulta. Maneja excepciones para errores en la base de datos y valida que los parámetros
     * no estén vacíos antes de realizar la consulta.
     *
     * @param string $pclvCarrera Clave de la carrera en formato válido (ejemplo: 'IINF-2010-220').
     * @param int    $psemestre   Número de semestre (1 a 12).
     * @param string $pgrupo      Letra que representa el grupo.
     * @param string $pturno      Turno correspondiente ('Matutino' o 'Vespertino').
     *
     * @return array Arreglo asociativo con las siguientes claves:
     *   - 'estado': 'OK' si la consulta fue exitosa, 'Error' si hubo un problema.
     *   - 'datos': arreglo con los registros de ofertas (si se encontraron).
     *   - 'mensaje': texto explicativo en caso de error o información adicional.
     *   - 'respuestaSP': mensaje devuelto por el procedimiento almacenado.
     */
    public function BuscarOfertasHorarios($pclvCarrera, $psemestre, $pgrupo, $pturno)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que los parámetros no estén vacíos o nulos
        if (empty($pclvCarrera) || empty($psemestre) || empty($pgrupo) || empty($pturno)) {
            $resultado['mensaje'] = "Ocurrió un problema interno al procesar la solicitud. Inténtelo nuevamente más tarde.";
            return $resultado;
        }

        try {
            // Preparar y ejecutar el procedimiento almacenado con los parámetros indicados
            $sp = $c->prepare("CALL spBuscarOfertasByCarreraSemestreGrupoTurno(:pclavecarrera, :psemestre, :pgrupo, :pturno, @mensaje)");
            $sp->bindParam(':pclavecarrera', $pclvCarrera, PDO::PARAM_STR);
            $sp->bindParam(':psemestre', $psemestre, PDO::PARAM_INT);
            $sp->bindParam(':pgrupo', $pgrupo, PDO::PARAM_STR);
            $sp->bindParam(':pturno', $pturno, PDO::PARAM_STR);

            $sp->execute();

            // Obtener todos los registros devueltos por el procedimiento
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar el cursor para la siguiente consulta

            // Consultar el mensaje de salida del procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Evaluar el mensaje y preparar la respuesta según el resultado
            switch ($resultado['respuestaSP']) {
                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['datos'] = $datos;
                    break;

                case 'Estado: No se encontraron registros':
                    $resultado['mensaje'] = "No se encontraron ofertas con la combinación seleccionada.";
                    break;

                default:
                    $resultado['mensaje'] = "Error inesperado al obtener la información de las ofertas. Inténtelo nuevamente más tarde.";
                    break;
            }
        } catch (PDOException $e) {
            // Registrar el error para depuración interna
            error_log("Error en la base de datos (BuscarOfertasHorarios): " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al acceder a la información. Por favor, intente nuevamente más tarde.";
        }

        return $resultado;
    }
        /**
     * Función para mostrar todos los horarios registrados en el sistema.
     * Llama al procedimiento almacenado spMostrarHorario.
     * 
     * @return array Retorna un array con el estado de la operación, mensaje, datos y cantidad de filas obtenidas.
     */
    public function MostrarHorario()
    {
        // Inicializar estado como OK por defecto
        $resultado['estado'] = "OK";
        $c = $this->conector;

        try {
            // Preparar y ejecutar el procedimiento almacenado
            $sp = $c->prepare("CALL spMostrarHorario(@mensaje)");
            $sp->execute();

            // Obtener todos los datos retornados
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar resultado para permitir obtener @mensaje

            // Consultar el mensaje de salida del procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log para depuración
            error_log("Mensaje spHorario: " . $resultado['respuestaSP']);

            // Verificar si el procedimiento fue exitoso
            if ($resultado['respuestaSP'] == 'Estado: Exito') {
                $resultado['datos'] = $datos;              // Asignar datos recuperados
                $resultado['filas'] = count($datos);       // Contar registros obtenidos
            } else {
                $resultado['filas'] = 0;
                $resultado['estado'] = "Sin registros de Horario para mostrar";
            }
        } catch (PDOException $e) {
            // Manejo de excepciones por errores en la base de datos
            $resultado['estado'] = "Error Mostrar Horario: " . $e->getMessage();
        }

        return $resultado;
    }

        /**
     * Función para buscar un Horario por ID.
     * Llama al procedimiento almacenado spBuscarHorarioByID.
     *
     * @param string $id ID del Horario a buscar.
     * @return array Retorna un array con el estado de la operación, mensaje y datos si se encuentra el docente.
     */
    public function BuscarHorario($id)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que el ID no esté vacío
        if (empty($id)) {
            $resultado['mensaje'] = "Error Modificar Horario: ID vacío.";
            return $resultado;
        }

        try {
            // Llamar al procedimiento almacenado con parámetro de entrada y salida
            $sp = $c->prepare("CALL spBuscarHorarioByID(:pid, @mensaje)");
            $sp->bindParam(':pid', $id, PDO::PARAM_STR);
            $sp->execute();

            // Obtener los datos devueltos por el procedimiento
            $datos = $sp->fetch(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar recursos

            // Obtener mensaje de salida del procedimiento
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Si el mensaje indica éxito, se devuelven los datos
            if ($resultado['respuestaSP'] === 'Estado: Exito') {
                $resultado['estado'] = "OK";
                $resultado['datos'] = $datos;
            } else {
                $resultado['mensaje'] = "Error Buscar Horario: No se encontró el Horario.";
            }
        } catch (PDOException $e) {
            // Captura de errores de la base de datos
            $resultado['mensaje'] = "Error Buscar Horario: problemas con la base de datos; " . $e->getMessage();
        }

        return $resultado;
    }

//Buscar alumnos que ya tienen horarios registrados
public function buscarAlumnos($carrera, $semestre, $grupo, $turno) {
    $c = $this->conector;
    $stmt = $c->prepare("CALL spBuscarAlumnosByCarreraSemestreGrupoTurno(?, ?, ?, ?, @mensaje)");
    $stmt->execute([$carrera, $semestre, $grupo, $turno]);

    // Recuperar alumnos
    $alumnos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt->closeCursor();

    // Recuperar el OUT @mensaje
    $mensajeResult = $c->query("SELECT @mensaje as mensaje")->fetch(PDO::FETCH_ASSOC);

    return [
        "alumnos" => $alumnos,
        "mensaje" => $mensajeResult['mensaje'] ?? null
    ];
}

// funcion para buscar ofertas asignadas
public function buscarOfertasAsignadas($carrera, $semestre, $grupo, $turno) {
    $c = $this->conector;

    // Preparar la llamada al procedimiento almacenado
    $stmt = $c->prepare("CALL spBuscarOfertasByCarreraSemestreGrupoTurnoAsignadas(?, ?, ?, ?, @mensaje)");
    $stmt->execute([$carrera, $semestre, $grupo, $turno]);

    // Recuperar los resultados de la SELECT del SP
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stmt->closeCursor();

    // Leer el valor del OUT (mensaje)
    $mensajeStmt = $c->query("SELECT @mensaje AS mensaje");
    $mensaje = $mensajeStmt->fetch(PDO::FETCH_ASSOC)['mensaje'] ?? null;

    return [
        "mensaje" => $mensaje,
        "data" => $resultados
    ];
}

/**
 * Función para modificar el estado de una oferta.
 * Llama al SP `spModificarEstadoOferta(idOferta, estado, OUT mensaje)` para poner la oferta en 'Asignada' o 'No asignada'.
 * Si el SP reporta 0 filas afectadas pero la oferta ya tenía ese estado, se considera éxito "sin cambios".
 * @param string $idOferta  ID de la oferta
 * @param string $estado    'Asignada' | 'No asignada'
 * @return array            ['estado' => 'OK|Error', 'mensaje' => string]
 */
public function modificarEstadoOferta(string $idOferta, string $estado): array {
    $c = $this->conector;

    // Llamada al SP
    $stmt = $c->prepare("CALL spModificarEstadoOferta(?, ?, @mensaje)");
    $stmt->execute([$idOferta, $estado]);
    $stmt->closeCursor();

    // Leer OUT
    $msgRow = $c->query("SELECT @mensaje AS mensaje")->fetch(PDO::FETCH_ASSOC);
    $msg = $msgRow['mensaje'] ?? null;

    if ($msg !== 'Estado: Exito') {
        $check = $c->prepare("SELECT estado FROM oferta WHERE idOferta = ?");
        $check->execute([$idOferta]);
        $curr = $check->fetchColumn();
        if ($curr === $estado) {
            return ['estado' => 'OK', 'mensaje' => 'Estado: Exito (sin cambios)'];
        }
        return ['estado' => 'Error', 'mensaje' => ($msg ?: 'Error modificando estado de oferta')];
    }

    return ['estado' => 'OK', 'mensaje' => $msg];
}

/**
 * Función para registrar una baja parcial de oferta (bitácora).
 * Llama al SP `spAgregarHBajaParcialOferta(noControl, semestre, idOferta, OUT mensaje)` e inserta en historial.
 * No modifica el horario; solo guarda el evento para auditoría.
 * @param string $noControl Número de control del alumno
 * @param int    $semestre  Semestre del registro
 * @param string $idOferta  ID de la oferta dada de baja parcial
 * @return array            ['estado' => 'OK|Error', 'mensaje' => string]
 */
public function agregarHBajaParcialOferta(string $noControl, int $semestre, string $idOferta): array {
    $c = $this->conector;

    $stmt = $c->prepare("CALL spAgregarHBajaParcialOferta(?, ?, ?, @mensaje)");
    $stmt->execute([$noControl, $semestre, $idOferta]);
    $stmt->closeCursor();

    $msgRow = $c->query("SELECT @mensaje AS mensaje")->fetch(PDO::FETCH_ASSOC);
    $msg = $msgRow['mensaje'] ?? null;

    return ['estado' => ($msg === 'Estado: Exito' ? 'OK' : 'Error'), 'mensaje' => ($msg ?: 'Error en bitácora')];
}

/**
 * Función para reconstruir el horario grupal desde BD.
 * Llama al SP `spModificarHorarioGrupal(carrera, semestre, grupo, turno, OUT mensaje)`,
 * que elimina los horarios actuales del grupo y vuelve a insertar según las ofertas marcadas como 'Asignada'.
 * @param string $carrera
 * @param int    $semestre
 * @param string $grupo
 * @param string $turno
 * @return array            ['estado' => 'OK|Error', 'mensaje' => string]
 */
public function reconstruirHorarioGrupal(string $carrera, int $semestre, string $grupo, string $turno): array {
    $c = $this->conector;

    $stmt = $c->prepare("CALL spModificarHorarioGrupal(?, ?, ?, ?, @mensaje)");
    $stmt->execute([$carrera, $semestre, $grupo, $turno]);
    $stmt->closeCursor();

    $msgRow = $c->query("SELECT @mensaje AS mensaje")->fetch(PDO::FETCH_ASSOC);
    $msg = $msgRow['mensaje'] ?? null;

    return ['estado' => ($msg === 'Estado: Exito' ? 'OK' : 'Error'), 'mensaje' => ($msg ?: 'Error al reconstruir')];
}

/**
 * Función para aplicar la modificación grupal completa
 * @param string $carrera
 * @param int    $semestre
 * @param string $grupo
 * @param string $turno
 * @param array  $alumnos   Array de noControl
 * @param array  $finales   Array de objetos con idOferta (quedan asignadas)
 * @param array  $quitadas  Array de objetos con idOferta (se desasignan)
 * @return array            ['estado' => 'OK|Error', 'mensaje' => string]
 */
public function aplicarModificacionGrupal(
    string $carrera, int $semestre, string $grupo, string $turno,
    array $alumnos, array $finales, array $quitadas
): array {

    foreach ($finales as $o) {
        $id = (string)($o['idOferta'] ?? $o['clave_oferta'] ?? '');
        if ($id === '') continue;
        $r = $this->modificarEstadoOferta($id, 'Asignada');
        if ($r['estado'] !== 'OK') {
            return ['estado'=>'Error', 'mensaje'=>"No se pudo marcar oferta $id como Asignada: ".$r['mensaje']];
        }
    }

    foreach ($quitadas as $o) {
        $id = (string)($o['idOferta'] ?? $o['clave_oferta'] ?? '');
        if ($id === '') continue;
        $r = $this->modificarEstadoOferta($id, 'No asignada');
        if ($r['estado'] !== 'OK') {
            return ['estado'=>'Error', 'mensaje'=>"No se pudo marcar oferta $id como No asignada: ".$r['mensaje']];
        }
    }

    $r = $this->reconstruirHorarioGrupal($carrera, $semestre, $grupo, $turno);
    if ($r['estado'] !== 'OK') {
        return ['estado'=>'Error', 'mensaje'=>$r['mensaje'] ?: 'Error reconstruyendo horarios'];
    }

    foreach ($alumnos as $nc) {
        foreach ($quitadas as $o) {
            $id = (string)($o['idOferta'] ?? $o['clave_oferta'] ?? '');
            if ($id === '') continue;
            $rb = $this->agregarHBajaParcialOferta($nc, $semestre, $id);
        }
    }

    return ['estado'=>'OK', 'mensaje'=>'Estado: Exito'];
}

}

