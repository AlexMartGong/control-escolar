<?php

class BajaDAO
{

    private $conector;

    /**
     * Constructor de la clase BajaDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

    public function AplicarBajasPorNoInscripcion()
    {
        $resultado = ['estado' => 'Error', 'mensaje' => 'Ocurrió un error desconocido.'];
        $c = $this->conector;

        try {
            $sp = $c->prepare("CALL sp_Inscripciones_Cierre()");
            $sp->execute();
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);

            if (!empty($datos) && count($datos) === 1 && count($datos[0]) === 1) {

                $mensajeSP = reset($datos)[array_key_first($datos[0])];

                if ($mensajeSP === 'No es tiempo') {
                    $resultado['mensaje'] = "Todavía no se ha alcanzado la fecha de cierre de inscripciones, no se pueden aplicar las bajas.";
                } elseif ($mensajeSP === 'Ya se aplicó') {
                    $resultado['mensaje'] = "La baja por no inscripción ya se aplicó para el periodo actual. No se puede realizar nuevamente.";
                }
            } else {
                $resultado['estado'] = 'OK';
            }
        } catch (PDOException $e) {
            error_log("Error BD (AplicarBajasPorNoInscripcion): " . $e->getMessage());
            $resultado['mensaje'] = "Se produjo un error al intentar aplicar las bajas por no inscripción. Inténtalo nuevamente más tarde.";
        }

        return $resultado;
    }

    /**
     * Función para mostrar todos las bajas registradas en el sistema.
     * Llama al procedimiento almacenado spMostrarBajas.
     * 
     * @return array Retorna un array con el estado de la operación, mensaje, datos y cantidad de filas obtenidas.
     */
    public function MostrarBajas()
    {
        $resultado = [
            'estado' => 'OK',
            'filas' => 0,
            'datos' => [],
            'respuestaSP' => ''
        ];

        $c = $this->conector;

        try {
            // Preparar y ejecutar el procedimiento almacenado
            $sp = $c->prepare("CALL spMostrarBajas(@mensaje)");
            $sp->execute();

            // Obtener todos los datos retornados
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor();

            $respuestaSP = $c->query("SELECT @mensaje as mensaje");
            $mensajeData = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensajeData['mensaje'];

            error_log("Mensaje spBaja: " . $resultado['respuestaSP']);

            if (!empty($datos) && strpos($resultado['respuestaSP'], 'exitosamente') !== false) {
                $resultado['datos'] = $datos;
                $resultado['filas'] = count($datos);
            } else {
                $resultado['estado'] = "Sin registros";
                $resultado['filas'] = 0;
            }
        } catch (PDOException $e) {
            $resultado['estado'] = "Error: " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Busca una baja por su ID en la base de datos.
     *
     * Este método ejecuta el procedimiento almacenado correspondiente para obtener
     * la información de una baja específica y valida los resultados devueltos.
     *
     * Validaciones realizadas:
     *  - Que el ID de la baja no esté vacío.
     *  - Que la baja exista en la base de datos.
     *  - Manejo de mensajes claros según el resultado devuelto por el SP.
     *
     * @param int $pclaveBaja ID de la baja a buscar.
     * @return array Retorna un array con:
     *               - 'estado': 'OK' si la búsqueda fue exitosa, 'Error' en caso contrario.
     *               - 'mensaje': Mensaje claro y amigable para el usuario.
     *               - 'respuestaSP': Texto devuelto por el procedimiento almacenado.
     *               - 'datos': Datos de la baja (si se encontró).
     */
    public function BuscarBaja($pclaveBaja)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // -----------------------------------------
        // Validaciones iniciales
        // -----------------------------------------
        if (empty($pclaveBaja)) {
            $resultado['mensaje'] = "No fue posible obtener la información de la baja seleccionada. Por favor, inténtalo nuevamente.";
            error_log("[BuscarParcial] El parámetro pclaveBaja llegó vacío.");
            return $resultado;
        }

        try {
            // -----------------------------------------
            // Ejecutar el SP 
            // -----------------------------------------
            $sp = $c->prepare("CALL spBuscarBajaByID(:pclaveBaja, @mensaje)");
            $sp->bindParam(':pclaveBaja', $pclaveBaja, PDO::PARAM_INT);
            $sp->execute();

            // Recuperar el parcial (si existe)
            $datos = $sp->fetch(PDO::FETCH_ASSOC);
            $sp->closeCursor();

            // Obtener el mensaje de salida
            $mensajeSP = $c->query("SELECT @mensaje")->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensajeSP['@mensaje'] ?? null;

            // -----------------------------------------
            // Validar mensaje del sp
            // -----------------------------------------
            switch ($resultado['respuestaSP']) {
                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['datos'] = $datos;
                    break;

                case 'Estado: No se encontro el registro':
                    $resultado['mensaje'] = "No fue posible encontrar la baja seleccionada. Verifica la selección e intenta nuevamente.";
                    break;

                case 'Estado: No se encontraron registros':
                    $resultado['mensaje'] = "No fue posible encontrar bajas disponibles. Intenta nuevamente más tarde.";
                    break;

                default:
                    $resultado['mensaje'] = "Ocurrió un error inesperado al buscar la baja. Inténtalo nuevamente más tarde.";
                    error_log("[BuscarBaja] Estado inesperado devuelto por SP: " . $resultado['respuestaSP']);
                    break;
            }
        } catch (PDOException $e) {
            // -----------------------------------------
            // Manejo de errores en la base de datos
            // -----------------------------------------
            error_log("[BuscarBaja] Error en BD: " . $e->getMessage());
            $resultado['mensaje'] = "No fue posible acceder a la información de la baja en este momento. Por favor, inténtalo de nuevo más tarde.";
        }

        return $resultado;
    }

    /**
     * Modifica una baja registrada en la base de datos.
     *
     * Validaciones realizadas:
     *  - Que ningún parámetro obligatorio esté vacío.
     *  - Que la baja exista en la base de datos.
     *  - Que la baja se encuentre en estado "Aplicada" (único estado permitido para modificar).
     *  - Que el alumno no tenga ya otra baja activa en el mismo periodo.
     *  - Que el periodo exista y esté en estado "Abierto" o "Pendiente".
     *  - Que la fecha ingresada no sea posterior a la fecha de término del periodo.
     *
     * Parámetros:
     *  @param int    $pclaveBaja   ID o clave de la baja a modificar.
     *  @param string $pfecha       Nueva fecha asociada a la baja (formato YYYY-MM-DD).
     *  @param string $pmotivo      Motivo de la modificación o descripción de la baja.
     *  @param int    $pidPeriodo   ID del periodo académico vinculado a la baja.
     *
     * Retorno:
     *  @return array Arreglo con:
     *               - 'estado': 'OK' si la modificación fue exitosa, 'Error' en caso contrario.
     *               - 'mensaje': Mensaje explicativo para el usuario.
     *               - 'respuestaSP': Mensaje original devuelto por el procedimiento almacenado.
     */
    public function ModificarBaja($pclaveBaja, $pfecha, $pmotivo, $pidPeriodo)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // -----------------------------------------
        // Validaciones básicas
        // -----------------------------------------

        if (empty($pclaveBaja) || empty($pfecha) || empty($pmotivo) || empty($pidPeriodo)) {
            $resultado['mensaje'] = "Faltan datos necesarios para completar la operación. Por favor revisa la información proporcionada y asegúrate de llenar todos los campos obligatorios.";
            return $resultado;
        }

        // -----------------------------------------
        // Validar baja
        // -----------------------------------------

        $sp = $c->prepare("CALL spBuscarBajaByID(:pclaveBaja, @mensaje)");
        $sp->bindParam(':pclaveBaja', $pclaveBaja, PDO::PARAM_INT);
        $sp->execute();
        $baja = $sp->fetch(PDO::FETCH_ASSOC);
        $sp->closeCursor();
        while ($sp->nextRowset()) {
        }

        $mensajeSP = $c->query("SELECT @mensaje");
        $mensaje = $mensajeSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'] ?? null;

        // Validar existencia de la baja
        if (
            $resultado['respuestaSP'] === 'Estado: No se encontro el registro' ||
            $resultado['respuestaSP'] === 'Estado: No se encontraron registros'
        ) {
            $resultado['mensaje'] = "No existe ninguna baja registrada con el ID proporcionado.";
            return $resultado;
        }

        // Validar estado de la baja
        if (
            $resultado['respuestaSP'] === 'Estado: Exito' &&
            isset($baja['estado']) && $baja['estado'] !== 'Aplicada'
        ) {
            $resultado['mensaje'] = "La modificación no puede realizarse, ya que la baja no se encuentra en estado 'Aplicada'.";
            return $resultado;
        }

        $noControl = $baja['numero_de_control'] ?? null;

        if (empty($noControl)) {
            error_log("Error; El numero de control para la validacion llego vacio:" . $noControl);
            return $resultado;
        }

        $sp2 = $c->prepare("CALL spExistePeriodoEnBaja(:pidPeriodo, :pclaveBaja, :pnoControl, @mensaje)");
        $sp2->bindParam(':pidPeriodo', $pidPeriodo, PDO::PARAM_INT);
        $sp2->bindParam(':pclaveBaja', $pclaveBaja, PDO::PARAM_INT);
        $sp2->bindParam(':pnoControl', $noControl, PDO::PARAM_STR);
        $sp2->execute();
        $sp2->closeCursor();

        // Leer mensaje del segundo SP
        $mensajeSP2 = $c->query("SELECT @mensaje")->fetch(PDO::FETCH_ASSOC);
        $estadoExistencia = $mensajeSP2['@mensaje'] ?? null;

        // Validar si ya existe una baja del alumno para ese periodo
        if ($estadoExistencia === 'Estado: Existe') {
            $resultado['mensaje'] = "No es posible realizar la modificación porque el alumno ya tiene una baja activa en este periodo.";
            return $resultado;
        }

        // -----------------------------------------
        // Validar periodo
        // -----------------------------------------

        $sp = $c->prepare("CALL spBuscarPeriodoByID(:pid)");
        $sp->bindParam(':pid', $pidPeriodo, PDO::PARAM_INT);
        $sp->execute();

        $periodo = $sp->fetch(PDO::FETCH_ASSOC);
        $sp->closeCursor();

        // Validar que el periodo exista y esté en estado Abierto o Pendiente
        if (!$periodo) {
            $resultado['mensaje'] = "El periodo seleccionado no existe. Verifique los datos ingresados.";
            return $resultado;
        }

        //Validar que el periodo sea Abierto o Pendiente
        if ($periodo['estado'] !== 'Abierto' && $periodo['estado'] !== 'Pendiente') {
            $resultado['mensaje'] = "El periodo seleccionado debe estar en estado 'Abierto' o 'Pendiente' para realizar esta operación.";
            return $resultado;
        }

        $fechaTermino = $periodo['fecha_de_termino'] ?? null;

        if ($fechaTermino && strtotime($pfecha) > strtotime($fechaTermino)) {
            $resultado['mensaje'] = "La fecha de la modificación no puede ser posterior a la fecha de término del periodo seleccionado ({$fechaTermino}).";
            return $resultado;
        }

        // -----------------------------------------
        // Llamada al SP para Modificar la baja
        // -----------------------------------------

        try {
            $sp = $c->prepare("CALL spModificarBaja(:pclaveBaja, :pfecha, :pmotivo, :pidPeriodo, @mensaje)");
            $sp->bindParam(':pclaveBaja', $pclaveBaja, PDO::PARAM_INT);
            $sp->bindParam(':pfecha', $pfecha, PDO::PARAM_STR);
            $sp->bindParam(':pmotivo', $pmotivo, PDO::PARAM_STR);
            $sp->bindParam(':pidPeriodo', $pidPeriodo, PDO::PARAM_INT);
            $sp->execute();
            $sp->closeCursor();

            $mensajeSP = $c->query("SELECT @mensaje")->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensajeSP['@mensaje'] ?? null;

            switch ($resultado['respuestaSP']) {
                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['mensaje'] = "El Registro de baja se ha modificado correctamente.";
                    break;

                case 'Error: No se pudo modificar el registro':
                    $resultado['mensaje'] = "Ocurrió un problema al modificar la baja. Por favor, inténtelo nuevamente.";
                    break;

                case 'Estado: Sin cambios':
                    $resultado['mensaje'] = "Los datos ingresados son idénticos a los actuales, por lo que no se realizó ninguna modificación.";
                    break;

                case 'Error: Ya existe una baja para ese periodo':
                    $resultado['mensaje'] = "No es posible realizar la modificación porque el alumno ya tiene una baja activa en este periodo.";
                    break;

                case 'Error: El perdiodo no es valido':
                    $resultado['mensaje'] = "El periodo seleccionado debe estar en estado 'Abierto' o 'Pendiente' para realizar esta operación.";
                    break;

                case 'Error: El periodo no existe':
                    $resultado['mensaje'] = "El periodo seleccionado no existe. Verifique los datos ingresados.";
                    break;

                case 'Error: La baja no esta aplicada':
                    $resultado['mensaje'] = "La modificación no puede realizarse, ya que la baja no se encuentra en estado 'Aplicada'.";
                    break;

                default:
                    $resultado['mensaje'] = "Ocurrió un error inesperado. Contacta al administrador si el problema persiste.";
                    error_log("[ModificarBaja] SP devolvió estado inesperado: " . $resultado['respuestaSP']);
                    break;
            }
        } catch (PDOException $e) {
            $resultado['mensaje'] = "No fue posible completar la operación en este momento. Por favor, intenta nuevamente en unos instantes.";
            error_log("[ModificarBaja] Error en BD al modificar oferta: " . $e->getMessage());
        }

        return $resultado;
    }

/**
 * Agrega una baja manualmente a un alumno en la base de datos.
 *
 * Validaciones realizadas:
 *  - Que ningún parámetro obligatorio esté vacío.
 *  - Que el alumno exista en el sistema.
 *  - Que el periodo exista en el sistema.
 *  - Que no exista ya una baja para el mismo alumno en el mismo periodo.
 *  - Que el motivo no esté vacío.
 *  - Que el tipo de baja sea válido ('Baja Temporal' o 'Baja Definitiva').
 *
 * @param string $pnoControl Número de control del alumno.
 * @param int    $pidPeriodo ID del periodo académico.
 * @param string $pmotivo    Motivo de la baja.
 * @param string $ptipo      Tipo de baja ('Baja Temporal' o 'Baja Definitiva').
 * @return array Retorna un array con:
 *               - 'estado': 'OK' si la operación fue exitosa, 'Error' en caso contrario.
 *               - 'mensaje': Mensaje explicativo para el usuario.
 *               - 'respuestaSP': Mensaje original devuelto por el procedimiento almacenado.
 */
public function AgregarBajaManual($pnoControl, $pidPeriodo, $pmotivo, $ptipo)
{
    $resultado = ['estado' => 'Error'];
    $c = $this->conector;

    // -----------------------------------------
    // Validaciones básicas
    // -----------------------------------------
    if (empty($pnoControl) || empty($pidPeriodo) || empty($pmotivo) || empty($ptipo)) {
        $resultado['mensaje'] = "Faltan datos necesarios para completar la operación. Por favor revisa la información proporcionada y asegúrate de llenar todos los campos obligatorios.";
        return $resultado;
    }

    // -----------------------------------------
    // Llamada al SP para agregar la baja manual
    // -----------------------------------------
    try {
        $sp = $c->prepare("CALL spAgregarBajaManual(:pnoControl, :pidPeriodo, :pmotivo, :ptipo, @mensaje)");
        $sp->bindParam(':pnoControl', $pnoControl, PDO::PARAM_STR);
        $sp->bindParam(':pidPeriodo', $pidPeriodo, PDO::PARAM_INT);
        $sp->bindParam(':pmotivo', $pmotivo, PDO::PARAM_STR);
        $sp->bindParam(':ptipo', $ptipo, PDO::PARAM_STR);
        $sp->execute();
        $sp->closeCursor();

        // Obtener el mensaje de salida del SP
        $mensajeSP = $c->query("SELECT @mensaje")->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensajeSP['@mensaje'] ?? null;

        // -----------------------------------------
        // Validar mensaje del SP
        // -----------------------------------------
        switch ($resultado['respuestaSP']) {
            case 'Estado: Exito':
                $resultado['estado'] = "OK";
                $resultado['mensaje'] = "La baja se ha registrado correctamente.";
                break;

            case 'Error: El alumno no existe':
                $resultado['mensaje'] = "El número de control proporcionado no corresponde a ningún alumno registrado.";
                break;

            case 'Error: El periodo no existe':
                $resultado['mensaje'] = "El periodo seleccionado no existe. Verifique los datos ingresados.";
                break;

            case 'Error: El alumno y la baja ya cuentan con una baja aplicada':
                $resultado['mensaje'] = "El alumno ya cuenta con una baja aplicada en el periodo seleccionado.";
                break;

            case 'Error: El motivo se encuentra vacio':
                $resultado['mensaje'] = "El motivo de la baja no puede estar vacío. Por favor, proporciona una descripción del motivo.";
                break;

            case 'Error: Tipo de baja invalido':
                $resultado['mensaje'] = "El tipo de baja seleccionado no es válido. Debe ser 'Baja Temporal' o 'Baja Definitiva'.";
                break;

            case 'Error: No se pudo agregar el registro':
                $resultado['mensaje'] = "Ocurrió un problema al registrar la baja. Por favor, inténtelo nuevamente.";
                break;

            default:
                $resultado['mensaje'] = "Ocurrió un error inesperado al registrar la baja. Contacta al administrador si el problema persiste.";
                error_log("[AgregarBajaManual] SP devolvió estado inesperado: " . $resultado['respuestaSP']);
                break;
        }
    } catch (PDOException $e) {
        $resultado['mensaje'] = "No fue posible completar la operación en este momento. Por favor, intenta nuevamente en unos instantes.";
        error_log("[AgregarBajaManual] Error en BD al agregar baja: " . $e->getMessage());
    }

    return $resultado;
}
}
