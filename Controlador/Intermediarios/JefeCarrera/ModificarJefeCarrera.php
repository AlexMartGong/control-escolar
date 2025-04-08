<?php
    // Archivo Intermediario para gestionar la búsqueda y modificación de Jefes de Carrera

    require '../../../Modelo/BD/ConexionBD.php';         // Conexión a la base de datos.
    require '../../../Modelo/BD/ModeloBD.php';          // Configuración de la base de datos.
    require '../../../Modelo/DAOs/JefeCarreraDAO.php'; // Operaciones relacionadas con el Jefe de Carrera.

    $datos = json_decode(file_get_contents("php://input"), true);

    // Verificar si los datos llegan correctamente
    error_log("Datos recibidos en PHP: " . json_encode($datos));

    // Inicializar la respuesta con estado de error
    $resultado = ['estado' => 'Error'];

    // Crear instancia de conexión y DAO
    $c = new ConexionBD($DatosBD);
    $conexion = $c->Conectar();
    $objDaoJefe = new JefeCarreraDAO($conexion);

    try {
        // Log de flujo de la solicitud
        error_log("Comprobando parámetros de la solicitud...");

        if (isset($datos['Buscar']) && $datos['Buscar'] === true) {
            // Búsqueda de Jefe de Carrera por ID
            if (isset($datos['id'])) {
                error_log("Realizando búsqueda para Jefe de Carrera con ID: " . $datos['id']);
                $resultado = $objDaoJefe->BuscarJefeCarrera($datos['id']);
                if (!$resultado) {
                    $resultado = ['estado' => 'Error', 'mensaje' => "Error Buscar JefeCarrera: No se encontró el Jefe de Carrera."];
                    error_log("No se encontró el Jefe de Carrera con ID: " . $datos['id']);
                }
            } else {
                $resultado = ['estado' => 'Error', 'mensaje' => "Error Buscar JefeCarrera: ID no proporcionado."];
                error_log("ID no proporcionado en la búsqueda de Jefe de Carrera.");
            }

        } elseif (isset($datos['Modificar']) && filter_var($datos['Modificar'], FILTER_VALIDATE_BOOLEAN)) {
            // Modificar Jefe de Carrera
            if (isset($datos['idJefe'], $datos['nombre'])) {
                error_log("Realizando modificación para el Jefe de Carrera con ID: " . $datos['idJefe'] . " y Nombre: " . $datos['nombre']);
                $resultado = $objDaoJefe->ModificarJefeCarrera(
                    $datos['idJefe'],
                    $datos['nombre']
                );

                if ($resultado['estado'] == "OK") {
                    $resultado = ['success' => true, 'mensaje' => $resultado['mensaje']];
                    error_log("Jefe de Carrera actualizado correctamente. ID: " . $datos['idJefe']);
                } else {
                    $resultado = ['success' => false, 'mensaje' => $resultado['mensaje']];
                    error_log("Error al actualizar el Jefe de Carrera con ID: " . $datos['idJefe']);
                }

            } else {
                $resultado = ['success' => false, 'mensaje' => "Error Modificar JefeCarrera: Datos insuficientes."];
                error_log("Datos insuficientes para modificar el Jefe de Carrera.");
            }
        } else {
            $resultado['mensaje'] = "Error Modificar JefeCarrera: Solicitud inválida.";
            error_log("Solicitud inválida: no se especificó 'Buscar' o 'Modificar'.");
        }
    } catch (PDOException $e) {
        $resultado['mensaje'] = "Error Modificar JefeCarrera: problemas en la base de datos; " . $e->getMessage();
        error_log("Error en la base de datos: " . $e->getMessage());
    }

    // Enviar la respuesta en formato JSON
    echo json_encode($resultado);
?>


