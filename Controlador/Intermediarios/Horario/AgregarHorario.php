<?php
// ----------------------------------------------------------------------
// Intermediario para agregar un nuevo horario grupal.
// Este archivo recibe datos JSON desde el frontend y coordina el proceso
// de inserción de un nuevo horario en la base de datos.
// ----------------------------------------------------------------------

require '../../../Modelo/BD/ConexionBD.php';      // Manejo de conexión a la base de datos
require '../../../Modelo/BD/ModeloBD.php';        // Configuración general de la conexión
require '../../../Modelo/DAOs/HorarioDAO.php';    // DAO con métodos específicos para el manejo de horarios

// Obtener y decodificar los datos recibidos del cliente
$datos = json_decode(file_get_contents("php://input"), true);

// Registrar en el log los datos recibidos (para depuración)
error_log("Datos recibidos para agregar horario grupal: " . json_encode($datos));

// Respuesta inicial por defecto en caso de error
$resultado = ['estado' => 'Error'];

// Establecer conexión con la base de datos e instanciar el DAO
$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoHorario = new HorarioDAO($conexion);

try {
    // Verificar que los campos requeridos estén presentes
    if (isset($datos['claveCarrera'], $datos['semestre'], $datos['grupo'], $datos['turno'])) 
    {
        // Llamar al método del DAO para registrar el horario grupal
        $resultado = $objDaoHorario->AgregarHorarioGrupal(
            $datos['claveCarrera'],
            $datos['semestre'],
            $datos['grupo'],
            $datos['turno']
        );

        // Evaluar el resultado del DAO y preparar la respuesta adecuada
        if ($resultado['estado'] === "OK") {
            $resultado = ['success' => true, 'mensaje' => $resultado['mensaje']];
            error_log("Horario grupal agregado correctamente para la carrera: " . $datos['claveCarrera']);
        } else {
            $resultado = ['success' => false, 'mensaje' => $resultado['mensaje']];
            error_log("Error al agregar horario grupal para la carrera: " . $datos['claveCarrera']);
        }
    } else {
        // Faltan datos requeridos en la solicitud
        $resultado = ['success' => false, 'mensaje' => "Faltan datos necesarios para registrar el horario. Por favor, verifica los campos ingresados."];
        error_log("Datos incompletos recibidos: " . print_r($datos, true));
    }

} catch (PDOException $e) {
    // Manejo de errores de base de datos
    $resultado['mensaje'] = "Error al agregar horario grupal: problema con la base de datos. " . $e->getMessage();
    error_log("Excepción PDO al insertar horario: " . $e->getMessage());
}

// Devolver la respuesta al cliente en formato JSON
echo json_encode($resultado);