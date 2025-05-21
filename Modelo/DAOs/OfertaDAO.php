<?php
class OfertaDAO
{
    private $conector;

    /**
     * Constructor de la clase CarreraDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

    /**
     * Función para obtener el siguiente ID de oferta.
     * Llama al procedimiento almacenado spMostrarSiguienteIDOferta para obtener el siguiente ID.
     * @return int - El siguiente ID de oferta.
     * @throws PDOException - Si ocurre un error al ejecutar la consulta.
     */
    function obtenerSiguienteIDOferta()
    {
        $c = $this->conector;

        try {
            $sp = $c->prepare("CALL spMostrarSiguienteIDOferta(@mensaje)");
            $sp->execute();

            $resultadoID = $sp->fetch(PDO::FETCH_ASSOC);
            $siguienteID = $resultadoID['siguiente_id'] ?? null;

            $sp->closeCursor();

            if ($siguienteID === null) {
                throw new Exception("El SP no devolvió un siguiente_id");
            }

            // Obtener el mensaje
            $selectMensaje = $c->query("SELECT @mensaje AS mensaje");
            $resultadoMensaje = $selectMensaje->fetch(PDO::FETCH_ASSOC);
            $mensaje = $resultadoMensaje['mensaje'];

            return $siguienteID;
        } catch (PDOException $e) {
            die("Error al llamar spMostrarSiguienteIDOferta: " . $e->getMessage());
        } catch (Exception $e) {
            die("Error: " . $e->getMessage());
        }
    }



    /**
     * Función para agregar un periodo.
     * @param object $datos - Objeto con los datos de la oferta a agregar.
     * @return array - Estado de la operación y mensaje.
     */
    public function AgregarOferta($datos)
    {
        $clave = $datos->clave;
        $semestre = $datos->semestre;
        $grupo = $datos->grupo;
        $turno = $datos->turno;
        $claveCarrera = $datos->claveCarrera;
        $claveMateria = $datos->claveMateria;
        $idPeriodo = $datos->idPeriodo;
        $claveDocente = $datos->claveDocente;

        try {
            $stmt = $this->conector->prepare("
            CALL spAgregarOferta(
                :clave,
                :semestre, 
                :grupo, 
                :turno, 
                :claveCarrera, 
                :claveMateria, 
                :idPeriodo, 
                :claveDocente, 
                @mensaje
            )
        ");

            $stmt->bindParam(':clave', $clave, PDO::PARAM_STR);
            $stmt->bindParam(':semestre', $semestre, PDO::PARAM_INT);
            $stmt->bindParam(':grupo', $grupo, PDO::PARAM_STR);
            $stmt->bindParam(':turno', $turno, PDO::PARAM_STR);
            $stmt->bindParam(':claveCarrera', $claveCarrera, PDO::PARAM_STR);
            $stmt->bindParam(':claveMateria', $claveMateria, PDO::PARAM_STR);
            $stmt->bindParam(':idPeriodo', $idPeriodo, PDO::PARAM_INT);
            $stmt->bindParam(':claveDocente', $claveDocente, PDO::PARAM_STR);

            $stmt->execute();

            $select = $this->conector->query("SELECT @mensaje AS mensaje");
            $resultado = $select->fetch(PDO::FETCH_ASSOC);
            $mensaje = $resultado['mensaje'];

            if (strpos($mensaje, 'Exito') !== false) {
                return [
                    'estado' => 'OK',
                    'mensaje' => 'Registro guardado correctamente.'
                ];
            } else {
                return [
                    'estado' => 'ERROR',
                    'mensaje' => $mensaje
                ];
            }
        } catch (PDOException $e) {
            return [
                'estado' => 'ERROR',
                'mensaje' => 'Excepción: ' . $e->getMessage()
            ];
        }
    }
    //Funcion para verificar si ya hay una oferta con los mismos datos
    public function OfertaYaExiste($datos)
    {
        try {
            $sql = "SELECT COUNT(*) FROM oferta 
                WHERE semestre = :semestre 
                AND grupo = :grupo 
                AND turno = :turno 
                AND claveCarrera = :claveCarrera 
                AND claveMateria = :claveMateria 
                AND idPeriodo = :idPeriodo 
                AND claveDocente = :claveDocente";

            $stmt = $this->conector->prepare($sql);
            $stmt->bindParam(':semestre', $datos->semestre);
            $stmt->bindParam(':grupo', $datos->grupo);
            $stmt->bindParam(':turno', $datos->turno);
            $stmt->bindParam(':claveCarrera', $datos->claveCarrera);
            $stmt->bindParam(':claveMateria', $datos->claveMateria);
            $stmt->bindParam(':idPeriodo', $datos->idPeriodo);
            $stmt->bindParam(':claveDocente', $datos->claveDocente);
            $stmt->execute();

            return $stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }


    /**
     * Función para mostrar todos las ofertas registradas en el sistema.
     * Llama al procedimiento almacenado spMostrarOferta.
     * 
     * @return array Retorna un array con el estado de la operación, mensaje, datos y cantidad de filas obtenidas.
     */
    public function MostrarOferta()
    {
        // Inicializar estado como OK por defecto
        $resultado['estado'] = "OK";
        $c = $this->conector;

        try {
            // Preparar y ejecutar el procedimiento almacenado
            $sp = $c->prepare("CALL spMostrarOferta(@mensaje)");
            $sp->execute();

            // Obtener todos los datos retornados
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar resultado para permitir obtener @mensaje

            // Consultar el mensaje de salida del procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log para depuración
            error_log("Mensaje spOferta: " . $resultado['respuestaSP']);

            // Verificar si el procedimiento fue exitoso
            if ($resultado['respuestaSP'] == 'Estado: Exito') {
                $resultado['datos'] = $datos;              // Asignar datos recuperados
                $resultado['filas'] = count($datos);       // Contar registros obtenidos
            } else {
                $resultado['filas'] = 0;
                $resultado['estado'] = "Sin registros de oferta para mostrar";
            }
        } catch (PDOException $e) {
            // Manejo de excepciones por errores en la base de datos
            $resultado['estado'] = "Error Mostrar oferta: " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Cambia el estado de una oferta en la base de datos.
     * 
     * Este método realiza múltiples validaciones de los datos de entrada
     * y luego llama al procedimiento almacenado `spModificarEstadoOferta`, que 
     * se encarga de modificar el estado de la oferta si cumple con las condiciones.
     * 
     * También interpreta el mensaje de salida del SP y proporciona una
     * respuesta clara para el usuario final.
     *
     * @param object $datos Objeto con las propiedades:
     *                      - pclave: ID entero de la oferta a modificar.
     *                      - pestado: Estado nuevo a asignar ("Asignada" o "No asignada").
     * @return array Retorna un array asociativo con el estado ('OK' o 'Error') 
     *               y un mensaje explicativo.
     */
    public function CambiarEstadoOfertas($datos)
    {
        // Inicializa el resultado con estado de error por defecto
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // -----------------------------------------
        // Validaciones
        // -----------------------------------------

        // Validar que el estado sea un valor aceptado
        if (empty($datos->pclave) || empty($datos->pestado)) {
            $resultado['mensaje'] = "Por favor, proporcione todos los campos requeridos: clave de la oferta y estado de la oferta";
            return $resultado;
        }

        // Validar que el idOferta sea un número entero positivo
        if (!filter_var($datos->pclave, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]])) {
            $resultado['mensaje'] = "El ID de la oferta debe ser un número entero positivo.";
            return $resultado;
        }

        // Validar que el estado sea un valor aceptado
        if ($datos->pestado !== "Asignada" && $datos->pestado !== "No asignada") {
            $resultado['mensaje'] = "El estado ingresado no es válido. Solo se permite 'Asignada' o 'No asignada'.";
            return $resultado;
        }

        // Validacion doble
        $sp = $c->prepare("CALL spBuscarOfertaByID(:pid, @mensaje)");
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

        // Verificar si ya existe una oferta con la misma clave (por ejemplo, al insertar)
        if ($mensaje['@mensaje'] === 'Error: No existen registros con el parámetro solicitado') {
            $resultado['mensaje'] = "El registro de oferta que se esta intentando modificar no existe, por favor intente con otro.";
            return $resultado;
        }

        // -----------------------------------------
        // Llamada al sp para hacer la funcionalidad
        // -----------------------------------------

        try {
            // Registrar en log el intento de ejecución del SP para trazabilidad
            error_log("Ejecutando SP para modificar el estado de la Materia con ID: $datos->pclave y Estado: $datos->pestado");

            // Preparar llamada al procedimiento almacenado con parámetros
            $sp = $c->prepare("CALL spModificarEstadoOferta(:pclave, :pestado, @mensaje)");
            $sp->bindParam(':pclave', $datos->pclave, PDO::PARAM_INT);
            $sp->bindParam(':pestado', $datos->pestado, PDO::PARAM_STR);
            $sp->execute();
            $sp->closeCursor(); // Cierra el cursor para liberar recursos antes de ejecutar otra consulta

            // Recuperar el mensaje generado por el procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log el mensaje devuelto por el SP
            error_log("Mensaje spModificarEstadoOferta: " . $resultado['respuestaSP']);

            // Interpretar el mensaje del SP y preparar la respuesta al usuario
            switch ($resultado['respuestaSP']) {

                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['mensaje'] = "El estado del registro fue actualizado exitosamente.";
                    break;

                case 'Error: No se pudo modificar el registro':
                    $resultado['mensaje'] = "No fue posible el cambio de estado de la Oferta. Por favor, intente nuevamente más tarde.";
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

    /**
     * Busca una oferta por su ID.
     * Llama al procedimiento almacenado spBuscarOfertaAllByID.
     *
     * @param string $id ID de la oferta a buscar.
     * @return array Retorna un array con el estado de la operación, mensaje y datos si se encuentra la oferta.
     */
    public function BuscarOferta($id)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que el ID no esté vacío
        if (empty($id)) {
            $resultado['mensaje'] = "Ocurrió un problema interno al procesar la solicitud. Inténtelo nuevamente más tarde.";
            return $resultado;
        }

        try {
            // Ejecutar procedimiento almacenado con parámetro de entrada y salida
            $sp = $c->prepare("CALL spBuscarOfertaAllByID(:pid, @mensaje)");
            $sp->bindParam(':pid', $id, PDO::PARAM_INT);
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

                case 'Error: No existen registros con el parámetro solicitado':
                    $resultado['mensaje'] = "Ocurrió un problema al obtener la información de la oferta seleccionada. Por favor, intente de nuevo.";
                    break;

                default:
                    $resultado['mensaje'] = "Algo salió mal al intentar obtener la información de la oferta. Por favor, vuelva a intentarlo más tarde.";
                    break;
            }
        } catch (PDOException $e) {
            // Registrar errores de la base de datos
            error_log("Error en la base de datos (BuscarOferta): " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al acceder a la información. Por favor, intente nuevamente más tarde.";
        }

        return $resultado;
    }

    /**
     * Modifica los datos de una oferta académica en la base de datos.
     * 
     * Este método realiza validaciones sobre los datos recibidos y llama al procedimiento almacenado 
     * `spModificarOferta` para actualizar una oferta existente con los nuevos datos proporcionados.
     * 
     * Las validaciones incluyen:
     *  - Verificar que todos los campos requeridos estén completos.
     *  - Validar que los identificadores sean números enteros positivos.
     *  - Comprobar que el semestre esté en el rango válido (1 a 12).
     *  - Verificar el formato correcto de grupo, turno, clave de carrera, clave de materia y clave de docente.
     *  - Validar que el periodo exista y que esté en estado 'Abierto' o 'Pendiente'.
     *  - Verificar que la oferta a modificar no duplique datos existentes.
     * 
     * @param int $pidOferta Identificador único de la oferta a modificar.
     * @param int $psemestre Número de semestre (1-12).
     * @param string $pgrupo Letra que representa el grupo (una sola letra).
     * @param string $pturno Turno de la oferta ('Matutino' o 'Vespertino').
     * @param string $pclvCarrera Clave de la carrera con formato 'AAAA-0000-000'.
     * @param string $pclvMateria Clave de la materia con formato 'AAA-0000'.
     * @param int $pidPeriodo Identificador del periodo académico (debe existir y estar abierto o pendiente).
     * @param string $pclvDocente Clave del docente con formato 'AAA-0000'.
     * 
     * @return array Arreglo asociativo con las claves:
     *   - 'estado': 'OK' si la actualización fue exitosa, 'Error' en caso contrario.
     *   - 'mensaje': Descripción del resultado o error ocurrido.
     *   - 'respuestaSP' (solo se usa en este metodo): Mensaje retornado por el procedimiento almacenado.
     */
    public function ModificarOferta($pidOferta, $psemestre, $pgrupo, $pturno, $pclvCarrera, $pclvMateria, $pidPeriodo, $pclvDocente)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // -----------------------------------------
        // Validaciones
        // -----------------------------------------

        // Validar que todos los campos requeridos estén presentes
        if (empty($pidOferta) || empty($psemestre) || empty($pgrupo) || empty($pturno) || empty($pclvCarrera) || empty($pclvMateria) || empty($pidPeriodo) || empty($pclvDocente)) {
            $resultado['mensaje'] = "Por favor, complete todos los campos obligatorios para continuar.";
            return $resultado;
        }

        // Validar que el idOferta sea un número entero positivo
        if (!filter_var($pidOferta, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]])) {
            $resultado['mensaje'] = "El ID de la oferta debe ser un número entero positivo válido.";
            return $resultado;
        }

        $datosOferta = (object)[
            'semestre' => $psemestre,
            'grupo' => $pgrupo,
            'turno' => $pturno,
            'claveCarrera' => $pclvCarrera,
            'claveMateria' => $pclvMateria,
            'idPeriodo' => $pidPeriodo,
            'claveDocente' => $pclvDocente
        ];

        // Validar si ya existe la oferta con esos datos
        if ($this->OfertaYaExiste($datosOferta)) {
            $resultado['mensaje'] = "No se puede modificar el registro porque ya existe una oferta con los mismos datos.";
            return $resultado;
        }

        // Validar que el semestre esté entre 1 y 12
        if (!filter_var($psemestre, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1, "max_range" => 12]])) {
            $resultado['mensaje'] = "El semestre debe ser un número entre 1 y 12.";
            return $resultado;
        }

        // Validar que el grupo sea una sola letra
        if (!preg_match('/^[A-Za-z]$/', $pgrupo)) {
            $resultado['mensaje'] = "El grupo debe ser una sola letra (por ejemplo: A, B, C).";
            return $resultado;
        }

        // Validar que el turno sea “Matutino” o “Vespertino”
        if ($pturno !== "Matutino" && $pturno !== "Vespertino") {
            $resultado['mensaje'] = "El turno debe ser 'Matutino' o 'Vespertino'.";
            return $resultado;
        }

        // Validar formato de la clave de la carrera
        if (!preg_match('/^[A-Za-z]{4}-\d{4}-\d{3}$/', $pclvCarrera)) {
            $resultado['mensaje'] = "La clave de la carrera debe tener este formato: IINF-2010-220 (4 letras, guion, 4 números, guion, 3 números).";
            return $resultado;
        }

        // Validar formato del ID de la materia
        if (!preg_match('/^[A-Za-z]{3}-\d{4}$/', $pclvMateria)) {
            $resultado['mensaje'] = "El ID de la materia debe seguir el formato: DAB-2302 (3 letras, guion, 4 números).";
            return $resultado;
        }

        //Validar que el id del periodo se un número entero positivo
        if (!filter_var($pidPeriodo, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]])) {
            $resultado['mensaje'] = "El ID del periodo debe ser un número entero positivo válido.";
            return $resultado;
        }

        $sp = $c->prepare("CALL spBuscarPeriodoByID(:pid)");
        $sp->bindParam(':pid', $pidPeriodo, PDO::PARAM_INT);
        $sp->execute();

        $periodo = $sp->fetch(PDO::FETCH_ASSOC);
        $sp->closeCursor();

        // Validar que el periodo exista y esté en estado Abierto o Pendiente
        if (!$periodo) {
            $resultado['mensaje'] = "El periodo ingresado no existe.";
            return $resultado;
        }

        //Validar que el periodo sea Abierto o Pendiente
        if ($periodo['estado'] !== 'Abierto' && $periodo['estado'] !== 'Pendiente') {
            $resultado['mensaje'] = "El periodo debe estar en estado 'Abierto' o 'Pendiente' para realizar esta operación.";
            return $resultado;
        }

        // Validar formato del ID del docente
        if (!preg_match('/^[A-Za-z]{3}-\d{4}$/', $pclvDocente)) {
            $resultado['mensaje'] = "El ID del docente debe tener este formato: ABC-1234 (3 letras, guion, 4 números).";
            return $resultado;
        }

        // -----------------------------------------
        // Llamada al sp para hacer la funcionalidad
        // -----------------------------------------

        try {

            // Preparar y ejecutar el procedimiento almacenado
            $sp = $c->prepare("CALL spModificarOferta(:pidOferta, :psemestre, :pgrupo, :pturno, :pclvCarrera, :pclvMateria, :pidPeriodo, :pclvDocente, @mensaje)");
            $sp->bindParam(':pidOferta', $pidOferta, PDO::PARAM_INT);
            $sp->bindParam(':psemestre', $psemestre, PDO::PARAM_INT);
            $sp->bindParam(':pgrupo', $pgrupo, PDO::PARAM_STR);
            $sp->bindParam(':pturno', $pturno, PDO::PARAM_STR);
            $sp->bindParam(':pclvCarrera', $pclvCarrera, PDO::PARAM_STR);
            $sp->bindParam(':pclvMateria', $pclvMateria, PDO::PARAM_STR);
            $sp->bindParam(':pidPeriodo', $pidPeriodo, PDO::PARAM_INT);
            $sp->bindParam(':pclvDocente', $pclvDocente, PDO::PARAM_STR);
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
                    $resultado['mensaje'] = "La información de la oferta se actualizó correctamente.";
                    break;

                case 'Error: No se pudo modificar el registro':
                    $resultado['mensaje'] = "No fue posible guardar los cambios en la oferta seleccionada. Por favor, verifique la información o intente nuevamente más tarde.";
                    break;

                default:
                    $resultado['mensaje'] = "Ocurrió un error inesperado al actualizar la oferta. Si el problema continúa, contacte al personal encargado.";
                    break;
            }
        } catch (PDOException $e) {
            // Registrar el error internamente
            error_log("Error en la base de datos al modificar oferta: " . $e->getMessage());
            error_log("Detalles del error: " . $e->getTraceAsString());

            // Mensaje para el usuario final
            $resultado['mensaje'] = "No se pudo completar la modificación por un problema interno. Intente nuevamente más tarde.";
        }


        return $resultado;
    }

    /**
     * Busca una carrera por su estado.
     * Llama al procedimiento almacenado spBuscarCarreraByEstado.
     *
     * @param string $pestado estado de la carrera a buscar.
     * @return array Retorna un array con el estado de la operación, mensaje y datos si se encuentra la carrera.
     */
    public function BuscarCarrerasActivas($pestado)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que el estado no esté vacío
        if (empty($pestado)) {
            $resultado['mensaje'] = "Ocurrió un problema interno al procesar la solicitud. Inténtelo nuevamente más tarde.";
            return $resultado;
        }

        try {
            // Ejecutar procedimiento almacenado con parámetro de entrada y salida
            $sp = $c->prepare("CALL spBuscarCarreraByEstado(:pestado, @mensaje)");
            $sp->bindParam(':pestado', $pestado, PDO::PARAM_STR);
            $sp->execute();

            // Obtener datos devueltos por el SELECT del procedimiento
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
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

                case 'Error: No existe el registro con el Estado ':
                    $resultado['mensaje'] = "Ocurrió un problema al obtener la información de las carreras activas. Por favor, intente de nuevo.";
                    break;

                default:
                    $resultado['mensaje'] = "Algo salió mal al intentar obtener la información de las carreras activas. Por favor, vuelva a intentarlo más tarde.";
                    break;
            }
        } catch (PDOException $e) {
            // Registrar errores de la base de datos
            error_log("Error en la base de datos (BuscarCarreraActiva): " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al acceder a la información. Por favor, intente nuevamente más tarde.";
        }

        return $resultado;
    }

    /**
     * Busca todos los periodos con estado 'Abierto' o 'Pendiente'.
     * Llama al procedimiento almacenado spMostrarPeriodos.
     *
     * @return array Retorna un array con el estado de la operación, mensaje y datos filtrados.
     */
    public function BuscarPeriodosActPen()
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        try {
            // Ejecutar el procedimiento almacenado que devuelve todos los periodos
            $sp = $c->prepare("CALL spMostrarPeriodos()");
            $sp->execute();

            // Obtener todos los registros como array
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar recursos del cursor

            // Filtrar solo los periodos con estado 'Abierto' o 'Pendiente'
            $filtrados = array_filter($datos, function ($periodo) {
                return isset($periodo['estado']) &&
                    ($periodo['estado'] === 'Abierto' || $periodo['estado'] === 'Pendiente');
            });

            // Verificar si se encontraron registros válidos
            if (empty($filtrados)) {
                $resultado['mensaje'] = "No se encontraron periodos con estado Abierto o Pendiente.";
            } else {
                $resultado['estado'] = "OK";
                $resultado['datos'] = array_values($filtrados); // Reindexar el array
            }
        } catch (PDOException $e) {
            // Registrar errores de la base de datos
            error_log("Error en la base de datos (BuscarPeriodosActPen): " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al acceder a la información. Por favor, intente nuevamente más tarde.";
        }

        return $resultado;
    }

    /**
     * Busca una materias por el id de una carrera.
     * Llama al procedimiento almacenado spBuscarOfertaAllByID.
     *
     * @param string $pclave ID de la oferta a buscar.
     * @return array Retorna un array con el estado de la operación, mensaje y datos si se encuentra la oferta.
     */
    public function BuscarMateriasporCarrera($pclave)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que el ID no esté vacío
        if (empty($pclave)) {
            $resultado['mensaje'] = "Ocurrió un problema interno al procesar la solicitud. Inténtelo nuevamente más tarde.";
            return $resultado;
        }

        try {
            // Ejecutar procedimiento almacenado con parámetro de entrada y salida
            $sp = $c->prepare("CALL spBuscarMateriasByIDCarrera(:pclave, @mensaje)");
            $sp->bindParam(':pclave', $pclave, PDO::PARAM_STR);
            $sp->execute();
            
            // Obtener datos devueltos por el SELECT del procedimiento
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
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
                    $resultado['mensaje'] = "Algo salió mal al intentar obtener la información de las materias. Por favor, vuelva a intentarlo más tarde.";
                    break;
            }
        } catch (PDOException $e) {
            // Registrar errores de la base de datos
            error_log("Error en la base de datos (BuscarMaterias): " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al acceder a la información. Por favor, intente nuevamente más tarde.";
        }

        return $resultado;
    }

    /**
     * Obtiene solo los docentes activos desde el SP spMostrarDocentes.
     *
     * @return array Retorna un array con el estado de la operación, mensaje y datos filtrados.
     */
    public function BuscarDocentesActivos()
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        try {
            // Ejecutar procedimiento almacenado (sin parámetros de entrada)
            $sp = $c->prepare("CALL spMostrarDocentes(@mensaje)");
            $sp->execute();

            // Obtener todos los registros retornados
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor();

            // Consultar el mensaje de salida
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Evaluar mensaje y filtrar los datos
            switch ($resultado['respuestaSP']) {
                case 'Estado: Exito':
                    // Filtrar los docentes que tengan estado = 'Activo'
                    $activos = array_filter($datos, function ($docente) {
                        return isset($docente['estado']) && $docente['estado'] === 'Activo';
                    });

                    $resultado['estado'] = 'OK';
                    $resultado['datos'] = array_values($activos); // Reindexar el array
                    break;

                case 'Error: No hay registros':
                    $resultado['mensaje'] = 'No hay docentes registrados.';
                    break;

                default:
                    $resultado['mensaje'] = 'Ocurrió un problema al obtener los docentes.';
                    break;
            }
        } catch (PDOException $e) {
            error_log("Error en la base de datos (BuscarDocentesActivos): " . $e->getMessage());
            $resultado['mensaje'] = 'Hubo un problema al acceder a la información. Por favor, intente nuevamente más tarde.';
        }

        return $resultado;
    }
}
