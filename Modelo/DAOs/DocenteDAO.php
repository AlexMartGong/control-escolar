<?php
class DocenteDAO
{
    private $conector;

    /**
     * Constructor de la clase DocenteDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

    //aqui va el metodo para agregar docente
    public function AgregarDocente($datos)
    {
        $id = $datos->id;
        $nombre = $datos->nombre;
        $perfil = $datos->perfil;

        try {
            $stmt = $this->conector->prepare("CALL spAgregarDocente(:id, :nombre, :perfil, @mensaje)");
            $stmt->bindParam(':id', $id, PDO::PARAM_STR);
            $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
            $stmt->bindParam(':perfil', $perfil, PDO::PARAM_STR);
            $stmt->execute();

            $select = $this->conector->query("select @mensaje as mensaje");
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
                'mensaje' => 'Excepcion: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Función para buscar un Docente por ID.
     * Llama al procedimiento almacenado spBuscarDocenteByID.
     *
     * @param string $id ID del Docente a buscar.
     * @return array Retorna un array con el estado de la operación, mensaje y datos si se encuentra el docente.
     */
    public function BuscarDocente($id)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que el ID no esté vacío
        if (empty($id)) {
            $resultado['mensaje'] = "Error Modificar Docente: ID vacío.";
            return $resultado;
        }

        try {
            // Llamar al procedimiento almacenado con parámetro de entrada y salida
            $sp = $c->prepare("CALL spBuscarDocenteByID(:pid, @mensaje)");
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
                $resultado['mensaje'] = "Error Buscar Docente: No se encontró el Docente.";
            }
        } catch (PDOException $e) {
            // Captura de errores de la base de datos
            $resultado['mensaje'] = "Error Buscar Docente: problemas con la base de datos; " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Función para modificar los datos de un Docente.
     * Llama al procedimiento almacenado spModificarDocente.
     *
     * @param string $pid ID del Docente. Debe tener el formato ABC-1234.
     * @param string $pnombre Nombre completo del Docente (máximo 50 caracteres).
     * @param string $pperfil Perfil académico del Docente.
     * @return array Retorna un array con el estado de la operación y un mensaje descriptivo.
     */
    public function ModificarDocente($pid, $pnombre, $pperfil)
    {
    $resultado = ['estado' => 'Error'];
    $c = $this->conector;

    // Validar que ningún campo esté vacío
    if (empty($pid) || empty($pnombre) || empty($pperfil)) {
        $resultado['mensaje'] = "Por favor, complete todos los campos requeridos: ID, nombre y perfil del docente.";
        return $resultado;
    }

    // Validar formato del ID (ejemplo: ABC-1234)
    if (!preg_match('/^[A-Za-z]{3}-\d{4}$/', $pid)) {
        $resultado['mensaje'] = "El ID del docente debe tener el formato correcto: tres letras seguidas de un guion y cuatro números (ejemplo: ABC-1234).";
        return $resultado;
    }

    // Validar nombre (solo letras, espacios y punto, máximo 50 caracteres, sin espacios consecutivos ni al inicio/final)
    if (!preg_match('/^[A-Za-zÁáÉéÍíÓóÚúÑñ](?:[A-Za-zÁáÉéÍíÓóÚúÑñ\s]*[A-Za-zÁáÉéÍíÓóÚúÑñ])?(?:[\.])?$/', $pnombre)) {
        $resultado['mensaje'] = "El Nombre del docente debe contener solo letras, espacios y puntos (.), sin espacios consecutivos ni al principio o final, y debe tener como máximo 50 caracteres.";
        return $resultado;
    }

    // Validar perfil (solo letras, espacios y punto, máximo 50 caracteres, sin espacios consecutivos ni al inicio/final)
    if (!preg_match('/^[A-Za-zÁáÉéÍíÓóÚúÑñ](?:[A-Za-zÁáÉéÍíÓóÚúÑñ\s]*[A-Za-zÁáÉéÍíÓóÚúÑñ])?(?:[\.])?$/', $pperfil)) {
        $resultado['mensaje'] = "El Perfil del docente debe contener solo letras, espacios y puntos (.), sin espacios consecutivos ni al principio o final, y debe tener como máximo 50 caracteres.";
        return $resultado;
    }

    try {
        // Log para seguimiento en el archivo de errores
        error_log("Ejecutando SP para modificar Docente con ID: $pid y Nombre: $pnombre");

        // Ejecutar procedimiento almacenado
        $sp = $c->prepare("CALL spModificarDocente(:pid, :pnombre, :pperfil, @mensaje)");
        $sp->bindParam(':pid', $pid, PDO::PARAM_STR);
        $sp->bindParam(':pnombre', $pnombre, PDO::PARAM_STR);
        $sp->bindParam(':pperfil', $pperfil, PDO::PARAM_STR);
        $sp->execute();
        $sp->closeCursor();

        // Obtener mensaje de salida del procedimiento
        $respuestaSP = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        // Registrar en log el mensaje del SP
        error_log("Mensaje spDocente: " . $resultado['respuestaSP']);

        // Evaluar mensaje del SP
        switch ($resultado['respuestaSP']) {
            case 'Estado: Exito':
                $resultado['estado'] = "OK";
                $resultado['mensaje'] = "Los datos del docente han sido modificados correctamente.";
                break;
            case 'Estado: Sin cambios':
                $resultado['mensaje'] = "No se realizaron cambios, los datos son idénticos a los actuales.";
                break;
            case 'Error: No existe el registro con el ID solicitado':
                $resultado['mensaje'] = "No se encontró el docente con el ID proporcionado.";
                break;
            case 'Error: No se pudo modificar el registro':
                $resultado['mensaje'] = "No se pudo modificar el registro del docente. Intente nuevamente más tarde.";
                break;
            default:
                $resultado['mensaje'] = "Ocurrió un error inesperado. Por favor, intente nuevamente.";
                break;
        }
    } catch (PDOException $e) {
        // Registrar error en el log
        error_log("Error en la base de datos: " . $e->getMessage());
        $resultado['mensaje'] = "Hubo un problema al modificar los datos del docente. Por favor, intente nuevamente más tarde.";
    }

    return $resultado;
    }


    //Aqui va el metodo para cambiar de estatus docente   
    public function CambiarEstado($datos)
    {
        $resultado['estado'] = "Error";

        if (empty($datos->pid) || empty($datos->pestado)) {
            $resultado['mensaje'] = "Error: No se permiten valores vacíos.";
            return $resultado;
        }

        $estadosValidos = ['Activo', 'Inactivo'];

        if (!in_array($datos->pestado, $estadosValidos)) {
            $resultado['mensaje'] = "Error: Estado no válido.";
            return $resultado;
        }

        try {
            // Verificar si el registro existe
            $consulta = $this->conector->prepare("SELECT estado FROM docente WHERE claveDocente = :pid");
            $consulta->bindParam(':pid', $datos->pid, PDO::PARAM_STR);
            $consulta->execute();
            $estadoActual = $consulta->fetchColumn();

            if ($estadoActual === false) {
                $resultado['mensaje'] = "Error: El registro no existe.";
                return $resultado;
            }

            // Ejecutar el procedimiento almacenado
            $sp = $this->conector->prepare("CALL spModificarEstadoDocente(:pclave, :pestado, @mensaje)");
            $sp->bindParam(':pclave', $datos->pid, PDO::PARAM_STR);
            $sp->bindParam(':pestado', $datos->pestado, PDO::PARAM_STR);
            $sp->execute();

            $msgQuery = $this->conector->query("SELECT @mensaje AS mensaje");
            $mensajeData = $msgQuery->fetch(PDO::FETCH_ASSOC);
            $mensaje = $mensajeData['mensaje'] ?? 'Sin mensaje recibido';


            // Recuperar el mensaje del OUT
            $resultado['mensaje'] = $mensaje;
            $resultado['estado'] = (str_contains($mensaje, 'Exito')) ? "OK" : "Error";
        } catch (PDOException $e) {
            $resultado['estado'] = "Error";
            $resultado['mensaje'] = "Error en la base de datos: " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Función para mostrar todos los Docentes registrados en el sistema.
     * Llama al procedimiento almacenado spMostrarDocentes.
     * 
     * @return array Retorna un array con el estado de la operación, mensaje, datos y cantidad de filas obtenidas.
     */
    public function MostrarDocente()
    {
        // Inicializar estado como OK por defecto
        $resultado['estado'] = "OK";
        $c = $this->conector;

        try {
            // Preparar y ejecutar el procedimiento almacenado
            $sp = $c->prepare("CALL spMostrarDocentes(@mensaje)");
            $sp->execute();

            // Obtener todos los datos retornados
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar resultado para permitir obtener @mensaje

            // Consultar el mensaje de salida del procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log para depuración
            error_log("Mensaje spDocente: " . $resultado['respuestaSP']);

            // Verificar si el procedimiento fue exitoso
            if ($resultado['respuestaSP'] == 'Estado: Exito') {
                $resultado['datos'] = $datos;              // Asignar datos recuperados
                $resultado['filas'] = count($datos);       // Contar registros obtenidos
            } else {
                $resultado['filas'] = 0;
                $resultado['estado'] = "Sin registros de Docente para mostrar";
            }
        } catch (PDOException $e) {
            // Manejo de excepciones por errores en la base de datos
            $resultado['estado'] = "Error Mostrar Docente: " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Función para verificar la clave del docente y si ya existe una igual 
     */
public function existeClave($clave) {
    $sql = "SELECT COUNT(*) AS total FROM docente WHERE claveDocente = :clave";
    $stmt = $this->conector->prepare($sql);
    $stmt->bindParam(':clave', $clave);
    $stmt->execute();
    $fila = $stmt->fetch(PDO::FETCH_ASSOC);
    return $fila['total'] > 0;
}
}



