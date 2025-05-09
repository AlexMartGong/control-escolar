<?php
    // Archivo Intermediario para gestionar la búsqueda y modificación de Materia

    require '../../../Modelo/BD/ConexionBD.php';         // Conexión a la base de datos.
    require '../../../Modelo/BD/ModeloBD.php';          // Configuración de la base de datos.
    require '../../../Modelo/DAOs/MateriaDAO.php';     // Operaciones relacionadas con el Materia.

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
    $objDaoMateria = new MateriaDAO($conexion);

    try {
        // Log de flujo de la solicitud
        error_log("Comprobando parámetros de la solicitud...");

            if (isset($datos)) {
                // Llamar al método CambiarEstadoMaterias y almacenar el resultado
                $resultado = $objDaoMateria->CambiarEstadoMaterias($datos);
                
                if ($resultado['estado'] == "OK") {
                    
                    $resultado = [
                        'estado' => 'OK',
                        'mensaje' => $resultado['mensaje']
                    ];
                    error_log("Estado actualizado correcta de la materia con ID: " . $datos->pclave);
                } else {
                    $resultado = [
                        'estado' => 'Error',
                        'mensaje' => $resultado['mensaje']
                    ];
                    error_log("Error al cambiar la materia con ID: " . $datos->pclave);
                }

            } else {
                $resultado = ['mensaje' => "Error al cambiar el estado de la materia: Datos insuficientes."];
                error_log("Datos insuficientes para cambiar el estado de una materia.");
            }

    } catch (PDOException $e) {
        $resultado['mensaje'] = "Error Modificar Materia: problemas en la base de datos; " . $e->getMessage();
        error_log("Error en la base de datos: " . $e->getMessage());
    }

    // Enviar la respuesta en formato JSON
    echo json_encode($resultado);