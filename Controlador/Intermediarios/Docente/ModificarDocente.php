<?php
    // Archivo Intermediario para gestionar la búsqueda y modificación de Docente

    require '../../../Modelo/BD/ConexionBD.php';         // Conexión a la base de datos.
    require '../../../Modelo/BD/ModeloBD.php';          // Configuración de la base de datos.
    require '../../../Modelo/DAOs/DocenteDAO.php';     // Operaciones relacionadas con el Docente.

    $datos = json_decode(file_get_contents("php://input"), true);

    // Verificar si los datos llegan correctamente
    error_log("Datos recibidos en PHP: " . json_encode($datos));

    // Inicializar la respuesta con estado de error
    $resultado = ['estado' => 'Error'];

    // Crear instancia de conexión y DAO
    $c = new ConexionBD($DatosBD);
    $conexion = $c->Conectar();
    $objDaoDocente = new DocenteDAO($conexion);

    try {
        // Log de flujo de la solicitud
        error_log("Comprobando parámetros de la solicitud...");

        if (isset($datos['Buscar']) && $datos['Buscar'] === true) {
            // Búsqueda de Docente por ID
            if (isset($datos['id'])) {
                error_log("Realizando búsqueda para Docente con ID: " . $datos['id']);
                $resultado = $objDaoDocente->BuscarDocente($datos['id']);
                if (!$resultado) {
                    $resultado = ['estado' => 'Error', 'mensaje' => "Error Buscar Docente: No se encontró el Docente."];
                    error_log("No se encontró el Docente con ID: " . $datos['id']);
                }
            } else {
                $resultado = ['estado' => 'Error', 'mensaje' => "Error Buscar Docente: ID no proporcionado."];
                error_log("ID no proporcionado en la búsqueda de Docente.");
            }

        } elseif (isset($datos['Modificar']) && filter_var($datos['Modificar'], FILTER_VALIDATE_BOOLEAN)) {
            // Modificar Docente
            if (isset($datos['idDocente'], $datos['nombre'], $datos['perfil'])) {
                error_log("Realizando modificación para el Docente con ID: " . $datos['idDocente'] . " Nombre: " . $datos['nombre']  . " y Perfil: " . $datos['perfil']);
                $resultado = $objDaoDocente->ModificarDocente(
                    $datos['idDocente'],
                    $datos['nombre'],
                    $datos['perfil']
                );
                
                if ($resultado['estado'] == "OK") {
                    $resultado = ['success' => true, 'mensaje' => $resultado['mensaje']];
                    error_log("Docente actualizado correctamente. ID: " . $datos['idDocente']);
                } else {
                    $resultado = ['success' => false, 'mensaje' => $resultado['mensaje']];
                    error_log("Error al actualizar el Docente con ID: " . $datos['idDocente']);
                }
                
            } else {
                $resultado = ['success' => false, 'mensaje' => "Error Modificar Docente: Datos insuficientes."];
                error_log("Datos insuficientes para modificar el Docente.");
            }
        } else {
            $resultado['mensaje'] = "Error Modificar Docente: Solicitud inválida.";
            error_log("Solicitud inválida: no se especificó 'Buscar' o 'Modificar'.");
        }
    } catch (PDOException $e) {
        $resultado['mensaje'] = "Error Modificar Docente: problemas en la base de datos; " . $e->getMessage();
        error_log("Error en la base de datos: " . $e->getMessage());
    }

    // Enviar la respuesta en formato JSON
    echo json_encode($resultado);
?>



