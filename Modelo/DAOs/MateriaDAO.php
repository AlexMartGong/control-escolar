<?php
class MateriaDAO
{
    private $conector;

    /**
     * Constructor de la clase MateriaDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

    /**
     * Función para mostrar todos las Materias registradas.
     * Llama al procedimiento almacenado spMostrarMaterias.
     * @return array - Array con el estado de la operación y los datos obtenidos.
     */
    function MostrarMaterias()
    {
        $resultado['estado'] = "OK";
        $c = $this->conector;

        try {

            $sp = $c->prepare("CALL spMostrarMaterias(@mensaje)");
            $sp->execute();

            // Obtener los datos primero
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Libera el conjunto de resultados actual para permitir ejecutar otra consulta en la misma conexión (por ejemplo, SELECT @mensaje)

            // Ahora obtener el mensaje de salida
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            error_log("Mensaje spMateria: " . $resultado['respuestaSP']);

            // Manejar mensaje de salida
            if ($resultado['respuestaSP'] == 'Estado: Exito') {
                $resultado['datos'] = $datos;
                $resultado['filas'] = count($datos);
            } else {
                $resultado['filas'] = 0;
                $resultado['estado'] = "Sin registros de Materias para mostrar";
            }
        } catch (PDOException $e) {
            $resultado['estado'] = "Error Mostrar Materias: " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Cambia el estado de una Materia en la base de datos.
     * 
     * Esta función llama al procedimiento almacenado `spModificarEstadoCarrera`, el cual modifica 
     * el estado de una Materia si cumple con las condiciones necesarias. También maneja la respuesta 
     * del SP para informar al usuario el resultado de la operación.
     *
     * @param string $pclave  Clave única de la Materia (ID).
     * @param string $pestado Estado deseado para la Materia: debe ser 'Activo' o 'Inactivo'.
     * @return array Retorna un array asociativo con el estado ('OK' o 'Error') y un mensaje para el usuario.
     */
    public function CambiarEstadoMaterias($datos)
    {
        // Inicializa el resultado con estado de error por defecto
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // -----------------------------------------
        // Validaciones
        // -----------------------------------------

        // Validar que el estado sea un valor aceptado
        if (empty($datos->pclave) || empty($datos->pestado)) {
            $resultado['mensaje'] = "Por favor, proporcione todos los campos requeridos: clave de la materia y estado de la materia";
            return $resultado;
        }

        // Validar formato la clave de la materia: tres letras, un guion, cuatro números (ej. ABC-1234)
        if (!preg_match('/^[A-Za-z]{3}-\d{4}$/', $datos->pclave)) {
            $resultado['mensaje'] = "La clave de la Materia debe tener el formato ABC-1234 (tres letras, guion y cuatro números).";
            return $resultado;
        }

        // Validar que el estado sea un valor aceptado
        if ($datos->pestado !== "Activo" && $datos->pestado !== "Inactivo") {
            $resultado['mensaje'] = "El estado ingresado no es válido. Solo se permite 'Activo' o 'Inactivo'.";
            return $resultado;
        }

        //Validar si el estado nuevo es diferente al actual
        $spB = $c->prepare("CALL spBuscarMateriaByID(:pid, @mensaje)");
        $spB->bindParam(':pid', $datos->pclave, PDO::PARAM_STR);
        $spB->execute();

        // Obtener la fila del resultado
        $materia = $spB->fetch(PDO::FETCH_ASSOC);
        $spB->closeCursor();

        $respuestaSPVB = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSPVB->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        if ($mensaje['@mensaje'] === 'Estado: Exito' && $materia['estado'] === $datos->pestado) {
            $resultado['mensaje'] = "No se realizó ningún cambio porque el estado ingresado es igual al actual.";
            return $resultado;
        }

        // -----------------------------------------
        // Llamada al sp para hacer la funcionalidad
        // -----------------------------------------

        try {
            // Registrar en log el intento de ejecución del SP para trazabilidad
            error_log("Ejecutando SP para modificar el estado de la Materia con ID: $datos->pclave y Estado: $datos->pestado");

            // Preparar llamada al procedimiento almacenado con parámetros
            $sp = $c->prepare("CALL spModificarEstadoMateria(:pclave, :pestado, @mensaje)");
            $sp->bindParam(':pclave', $datos->pclave, PDO::PARAM_STR);
            $sp->bindParam(':pestado', $datos->pestado, PDO::PARAM_STR);
            $sp->execute();
            $sp->closeCursor(); // Cierra el cursor para liberar recursos antes de ejecutar otra consulta

            // Recuperar el mensaje generado por el procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log el mensaje devuelto por el SP
            error_log("Mensaje spModificarEstadoMateria: " . $resultado['respuestaSP']);

            // Interpretar el mensaje del SP y preparar la respuesta al usuario
            switch ($resultado['respuestaSP']) {
                case 'Estado: Sin cambios':
                    $resultado['mensaje'] = "No se realizó ningún cambio porque el estado ingresado es igual al actual.";
                    break;

                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['mensaje'] = "El estado del registro fue actualizado exitosamente.";
                    break;

                case 'Error: No se pudo modificar el registro':
                    $resultado['mensaje'] = "No fue posible la Materia. Por favor, intente nuevamente más tarde.";
                    break;

                default:
                    // Manejo de errores desconocidos devueltos por el SP
                    $resultado['mensaje'] = "Ocurrió un error inesperado. Contacte al administrador si el problema persiste.";
                    break;
            }
        } catch (PDOException $e) {
            // Registro detallado de errores para depuración en caso de excepción
            error_log("Error en la base de datos: " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al cambiar el estado de la materia. Por favor, intente nuevamente más tarde.";
        }

        // Devolver resultado final con estado y mensaje
        return $resultado;
    }

    /**
     * Registra una nueva materia en la base de datos.
     * 
     * Este método realiza múltiples validaciones de los datos de entrada
     * y luego llama al procedimiento almacenado `spAgregarMateria`, que 
     * se encarga de insertar la materia si cumple con las condiciones.
     * 
     * También interpreta el mensaje de salida del SP y proporciona una
     * respuesta clara para el usuario final.
     *
     * @param object $datos Objeto con las propiedades:
     *                      - pclave: Clave única de la materia (formato ABC-1234)
     *                      - pnombre: Nombre de la materia (hasta 100 caracteres, letras y espacios)
     *                      - punidades: Número de unidades (≥1)
     *                      - phrsteoricas: Horas teóricas (≥1)
     *                      - phrspracticas: Horas prácticas (≥1)
     *                      - pcreditos: Créditos asignados (≥1)
     *                      - pclaveCarrera: Clave de la carrera asociada
     * @return array Retorna un array asociativo con el estado ('OK' o 'Error') y un mensaje explicativo.
     */
    public function AgregarMaterias($datos)
    {
        // Inicializa el resultado con estado de error por defecto
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // -----------------------------------------
        // Validaciones
        // -----------------------------------------

        // Validar que el estado sea un valor aceptado
        if (empty($datos->pclave) || empty($datos->pnombre) || empty($datos->punidades) || empty($datos->phrsteoricas) || empty($datos->phrspracticas) || empty($datos->pcreditos) || empty($datos->pclaveCarrera)) {
            $resultado['mensaje'] = "Por favor, proporcione todos los campos para insertar una materia.";
            return $resultado;
        }

        // Validar formato la clave de la materia: tres letras, un guion, cuatro números (ej. ABC-1234)
        if (!preg_match('/^[A-Za-z]{3}-\d{4}$/', $datos->pclave)) {
            $resultado['mensaje'] = "La clave de la Materia debe tener el formato ABC-1234 (tres letras, guion y cuatro números).";
            return $resultado;
        }

        // Validar el campo nombre (solo letras, espacios, acentos y máximo 100 caracteres)
        if (!preg_match('/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{1,100}$/u', $datos->pnombre)) {
            $resultado['mensaje'] = "El nombre solo debe contener letras, espacios y tener como máximo 100 caracteres.";
            return $resultado;
        }

        // Validar que estos campos sean numéricos y mayores o iguales a 1
        if (
            !is_numeric($datos->punidades) || $datos->punidades < 1 ||
            !is_numeric($datos->phrsteoricas) || $datos->phrsteoricas < 1 ||
            !is_numeric($datos->phrspracticas) || $datos->phrspracticas < 1 ||
            !is_numeric($datos->pcreditos) || $datos->pcreditos < 1
        ) {
            $resultado['mensaje'] = "Por favor, asegúrate de que los campos: Unidades, Horas teóricas, Horas prácticas y Créditos contengan números válidos mayores o iguales a 1.";
            return $resultado;
        }

        // Validar formato de la clave de la carrera: cuatro letras, guion, cuatro números, guion, tres números (ej. IINF-2010-220)
        if (!preg_match('/^[A-Za-z]{4}-\d{4}-\d{3}$/', $datos->pclaveCarrera)) {
            $resultado['mensaje'] = "La clave de la Carrera debe tener el formato IINF-2010-220 (cuatro letras, guion, cuatro números, guion, tres números).";
            return $resultado;
        }

        // Verifica si ya existe una materia con la misma clave antes de intentar agregarla
        $sp = $c->prepare("CALL spBuscarMateriaByID(:clave, @mensaje)");
        $sp->bindParam(':clave', $datos->pclave, PDO::PARAM_STR);
        $sp->execute();
        $sp->closeCursor();

        $respuestaSPV = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSPV->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        if ($respuestaSPV === 'Estado: Exito') {
            $resultado['mensaje'] = "Ya existe una materia registrada con la clave ingresada. Por favor, utiliza una clave diferente.";
            return $resultado;
        }

        // -----------------------------------------
        // Llamada al sp para hacer la funcionalidad
        // -----------------------------------------

        try {
            // Registrar en log el intento de ejecución del SP para trazabilidad
            error_log("Ejecutando SP para agregar una Materia con ID: $datos->pclave y Nombre: $datos->pnombre");

            // Preparar llamada al procedimiento almacenado con parámetros
            $sp = $c->prepare("CALL spAgregarMateria(:pclave, :pnombre, :punidades, :phrsteoricas, :phrspracticas, :pcreditos, :pclaveCarrera, @mensaje)");
            $sp->bindParam(':pclave', $datos->pclave, PDO::PARAM_STR);
            $sp->bindParam(':pnombre', $datos->pnombre, PDO::PARAM_STR);
            $sp->bindParam(':punidades', $datos->punidades, PDO::PARAM_INT);
            $sp->bindParam(':phrsteoricas', $datos->phrsteoricas, PDO::PARAM_INT);
            $sp->bindParam(':phrspracticas', $datos->phrspracticas, PDO::PARAM_INT);
            $sp->bindParam(':pcreditos', $datos->pcreditos, PDO::PARAM_INT);
            $sp->bindParam(':pclaveCarrera', $datos->pclaveCarrera, PDO::PARAM_STR);
            $sp->execute();
            $sp->closeCursor(); // Cierra el cursor para liberar recursos antes de ejecutar otra consulta

            // Recuperar el mensaje generado por el procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log el mensaje devuelto por el SP
            error_log("Mensaje spAgregarMateria: " . $resultado['respuestaSP']);

            // Interpretar el mensaje del SP y preparar la respuesta al usuario
            switch ($resultado['respuestaSP']) {
                case 'Error: La clave de Materia ya existe':
                    $resultado['mensaje'] = "Ya existe una materia registrada con la clave ingresada. Por favor, utiliza una clave diferente.";
                    break;

                case 'Error: Unidades, horas y creditos deben ser mayores a cero':
                    $resultado['mensaje'] = "Por favor, asegúrate de que los campos: Unidades, Horas teóricas, Horas prácticas y Créditos contengan números válidos mayores o iguales a 1.";
                    break;

                case 'Error: No se pudo agregar el registro':
                    $resultado['mensaje'] = "Ocurrió un error y no se pudo registrar la materia. Por favor, intenta nuevamente más tarde.";
                    break;

                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['mensaje'] = "La materia fue registrada exitosamente en el sistema.";
                    break;

                default:
                    // Manejo de errores desconocidos devueltos por el SP
                    $resultado['mensaje'] = "Ocurrió un error inesperado. Contacta al administrador si el problema persiste.";
                    break;
            }
        } catch (PDOException $e) {
            // Registro detallado de errores para depuración en caso de excepción
            error_log("Error en la base de datos: " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al agregar la materia. Por favor, intente nuevamente más tarde.";
        }

        // Devolver resultado final con estado y mensaje
        return $resultado;
    }

    /**
     * Verifica si ya existe una clave de materia en la base de datos.
     *
     * @param string $clave - Clave de la materia a verificar.
     * @return bool - Retorna true si la clave ya existe, false si no.
     */
    public function existeClaveMateria($clave)
    {
        // Consulta SQL que cuenta cuántas veces aparece la clave en la tabla "materia"
        $sql = "SELECT COUNT(*) AS total FROM materia WHERE claveMateria = :clave";

        // Preparar la consulta
        $stmt = $this->conector->prepare($sql);

        // Asociar el parámetro :clave con el valor recibido
        $stmt->bindParam(':clave', $clave);

        // Ejecutar la consulta
        $stmt->execute();

        // Obtener el resultado como un arreglo asociativo
        $fila = $stmt->fetch(PDO::FETCH_ASSOC);

        // Retornar true si el total es mayor a 0, es decir, ya existe una materia con esa clave
        return $fila['total'] > 0;
    }

    /**
     * Busca una materia por su ID.
     * Llama al procedimiento almacenado spBuscarMateriaByID.
     *
     * @param string $id ID de la materia a buscar.
     * @return array Retorna un array con el estado de la operación, mensaje y datos si se encuentra la carrera.
     */
    public function BuscarMateria($id)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que el ID no esté vacío
        if (empty($id)) {
            $resultado['mensaje'] = "Debe proporcionar el ID de la materia para realizar la búsqueda.";
            return $resultado;
        }

        try {
            // Ejecutar procedimiento almacenado con parámetro de entrada y salida
            $sp = $c->prepare("CALL spBuscarMateriaByID(:pid, @mensaje)");
            $sp->bindParam(':pid', $id, PDO::PARAM_STR);
            $sp->execute();

            // Obtener datos devueltos por el SELECT del procedimiento
            $datos = $sp->fetch(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar recursos del cursor

            // Consultar el mensaje de salida del procedimiento
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log el mensaje recibido del SP
            error_log("Mensaje spBuscarMateriaByID: " . $resultado['respuestaSP']);

            // Evaluar mensaje de salida usando switch
            switch ($resultado['respuestaSP']) {
                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['datos'] = $datos;
                    $resultado['mensaje'] = "Materia encontrada exitosamente.";
                    break;

                case 'Error: No existe el registro con el ID solicitado':
                    $resultado['mensaje'] = "No se encontró ninguna materia con el ID proporcionado.";
                    break;

                default:
                    $resultado['mensaje'] = "Ocurrió un error inesperado al buscar la materia. Por favor, intente más tarde.";
                    break;
            }
        } catch (PDOException $e) {
            // Registrar errores de la base de datos
            error_log("Error en la base de datos (BuscarCarrera): " . $e->getMessage());
            $resultado['mensaje'] = "Error de base de datos al buscar la materia. Intente nuevamente más tarde.";
        }

        return $resultado;
    }


    /**
     * Modifica los datos de una materia en la base de datos.
     * 
     * Esta función llama al procedimiento almacenado `spModificarMateria` para actualizar el nombre 
     * y el jefe de la carrera correspondiente a la clave proporcionada.
     *
     * @param string $pclave Clave de la materia (clave primaria).
     * @param string $pnombre Nombre de la Materia (hasta 50 caracteres).
     * @param string $pid ID de la carrera en formato IINF-2010-220.
     * @return array Retorna un arreglo asociativo con el estado ('OK' o 'Error') y un mensaje descriptivo.
     */
    public function ModificarMateria($pid, $pnombre, $punidades, $phrsteoricas, $phrspracticas, $pcreditos, $pclave)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que todos los campos requeridos estén presentes
        if (empty($pclave) || empty($pnombre) || empty($pid) || empty($punidades) || empty($phrsteoricas) || empty($phrspracticas) || empty($pcreditos)) {
            $resultado['mensaje'] = "Por favor, complete todos los campos requeridos: clave, nombre, unidades, horas teoricas, horas practicas, creditos e ID de la carrera.";
            return $resultado;
        }

        // Validar formato del ID de la Materia: tres letras, un guion, cuatro números (ej. DAB-2302)
        if (!preg_match('/^[A-Za-z]{3}-\d{4}$/', $pid)) {
            $resultado['mensaje'] = "El ID de la materia debe tener el formato DAB-2302 (tres letras, guion, cuatro números).";
            return $resultado;
        }

        // Validar el nombre de la carrera: solo letras, espacios y punto, sin espacios innecesarios
        if (!preg_match('/^[A-Za-zÁÉÍÓÚÑáéíóúñ](?:[A-Za-zÁÉÍÓÚÑáéíóúñ\s]*[A-Za-zÁÉÍÓÚÑáéíóúñ])?(?:\.)?$/u', $pnombre)) {
            $resultado['mensaje'] = "El nombre de la Materia debe contener solo letras, espacios y puntos. No se permiten espacios al inicio o final.";
            return $resultado;
        }

        try {
            // Registrar en el log el inicio de la operación
            error_log("Ejecutando SP: Modificar Materia con id '$pid', nombre '$pnombre', unidades '$punidades' horasTeoricas '$phrsteoricas', horasPracticas '$phrspracticas', creditos '$pcreditos' clave '$pclave'");

            // Preparar y ejecutar el procedimiento almacenado
            $sp = $c->prepare("CALL spModificarMateria(:pid, :pnombre, :punidades, :phrsteoricas, :phrspracticas, :pcreditos, :pclave, @mensaje)");
            $sp->bindParam(':pid', $pid, PDO::PARAM_STR);
            $sp->bindParam(':pnombre', $pnombre, PDO::PARAM_STR);
            $sp->bindParam(':punidades', $punidades, PDO::PARAM_INT);
            $sp->bindParam(':phrsteoricas', $phrsteoricas, PDO::PARAM_INT);
            $sp->bindParam(':phrspracticas', $phrspracticas, PDO::PARAM_INT);
            $sp->bindParam(':pcreditos', $pcreditos, PDO::PARAM_INT);
            $sp->bindParam(':pclave', $pclave, PDO::PARAM_STR);
            $sp->execute();
            $sp->closeCursor();

            // Recuperar el mensaje devuelto por el procedimiento
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar mensaje del SP en log para depuración
            error_log("Mensaje recibido del SP: " . $resultado['respuestaSP']);

            // Interpretar el mensaje del SP y generar una respuesta adecuada
            switch ($resultado['respuestaSP']) {
                case 'Error: El registro no existe':
                    $resultado['mensaje'] = "No se encontró la Materia con la clave proporcionada. Verifique e intente nuevamente.";
                    break;
                case 'Estado: Sin cambios':
                    $resultado['mensaje'] = "No se realizaron modificaciones porque los datos ingresados son idénticos a los actuales.";
                    break;
                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['mensaje'] = "La información de la Materia se ha actualizado correctamente.";
                    break;
                case 'Error: No se pudo modificar el registro':
                    $resultado['mensaje'] = "Ocurrió un problema al intentar modificar la materia. Por favor, inténtelo nuevamente más tarde.";
                    break;
                default:
                    $resultado['mensaje'] = "Ocurrió un error inesperado al procesar la solicitud. Contacte al administrador si el problema persiste.";
                    break;
            }
        } catch (PDOException $e) {
            // Captura de errores de conexión o ejecución SQL
            error_log("Error en la base de datos al modificar materia: " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al modificar los datos de la materia. Por favor, intente nuevamente más tarde.";
            // Imprimir el mensaje para depuración
            error_log("Detalles del error: " . $e->getTraceAsString());
        }

        return $resultado;
    }
}
