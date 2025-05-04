<?php
    // Archivo Intermediario para gestionar la búsqueda y modificación de Docente

    require '../../../Modelo/BD/ConexionBD.php';         // Conexión a la base de datos.
    require '../../../Modelo/BD/ModeloBD.php';          // Configuración de la base de datos.
    require '../../../Modelo/DAOs/CarreraDAO.php';     // Operaciones relacionadas con el Docente.

    $datos = json_decode(file_get_contents("php://input"), true);

    // Decodificar los datos JSON recibidos en el cuerpo de la solicitud
    $datos = json_decode(file_get_contents("php://input"));

    // Inicializar la respuesta con estado de error
    $resultado = ['estado' => 'Error'];

    // Mapear los campos
    $datos->pclave = $datos->id ?? null;
    $datos->pestado = $datos->status === "Activo" ? "Activo" : "Inactivo";  // Aseguramos que el estado sea 'Activo' o 'Inactivo'

    // Crear instancia de conexión y DAO
    $c = new ConexionBD($DatosBD);
    $conexion = $c->Conectar();
    $objDaoCarrera = new CarreraDAO($conexion);

    try {
        // Log de flujo de la solicitud
        error_log("Comprobando parámetros de la solicitud...");

            if (isset($datos)) {
                // Llamar al método CambiarEstado y almacenar el resultado
                $resultado = $objDaoCarrera->CambiarEstadoCarrera($datos);
                
                if ($resultado['estado'] == "OK") {
                    
                    $resultado = [
                        'estado' => 'OK',
                        'mensaje' => $resultado['mensaje']
                    ];
                    error_log("Estado actualizado correcta de la carrera con ID: " . $datos->pclave);
                } else {
                    $resultado = [
                        'estado' => 'Error',
                        'mensaje' => $resultado['mensaje']
                    ];
                    error_log("Error al cambiar la carrera con ID: " . $datos->pclave);
                }

            } else {
                $resultado = ['mensaje' => "Error al cambiar el estado del docente: Datos insuficientes."];
                error_log("Datos insuficientes para cambiar el estado de una carrera.");
            }

    } catch (PDOException $e) {
        $resultado['mensaje'] = "Error Modificar Docente: problemas en la base de datos; " . $e->getMessage();
        error_log("Error en la base de datos: " . $e->getMessage());
    }

    // Enviar la respuesta en formato JSON
    echo json_encode($resultado);
?>