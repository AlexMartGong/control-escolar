<?php
// ----------------------------------------------------------------------
// Intermediario para buscar alumnos según carrera, semestre, grupo y turno.
// Este archivo recibe datos JSON desde el frontend y gestiona la solicitud
// para obtener la lista de alumnos correspondientes desde la base de datos.
// ----------------------------------------------------------------------

// Cargar las clases necesarias para la conexión y lógica de acceso a datos
require '../../../Modelo/BD/ConexionBD.php';      // Clase para conexión a la base de datos
require '../../../Modelo/BD/ModeloBD.php';        // Configuración de parámetros de conexión
require '../../../Modelo/DAOs/HorarioDAO.php';    // DAO con métodos relacionados con horarios y alumnos

// Obtener y decodificar los datos enviados desde el cliente (JSON)
$datos = json_decode(file_get_contents("php://input"), true);

// Registrar en el log los datos recibidos (útil para depuración)
error_log("Datos recibidos para buscar alumnos: " . json_encode($datos));

// Valor por defecto de la respuesta
$resultado = ['estado' => 'Error'];

// Crear la conexión con la base de datos e instanciar el DAO
$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoHorario = new HorarioDAO($conexion);

try {
    // Verificar que todos los campos necesarios estén presentes
    if (isset($datos['claveCarrera'], $datos['semestre'], $datos['grupo'], $datos['turno'])) 
    {
        // Llamar al método del DAO para buscar alumnos que coincidan con los criterios
        $resultado = $objDaoHorario->BuscarAlumnosHorarios(
            $datos['claveCarrera'],
            $datos['semestre'],
            $datos['grupo'],
            $datos['turno']
        );

        // Comprobar el resultado del DAO
        if ($resultado['estado'] === "OK") {
        } else {    
            // El DAO devolvió un estado de error
            $resultado = ['success' => false, 'mensaje' => $resultado['mensaje']];
            error_log("No se encontraron alumnos para la carrera: " . $datos['claveCarrera']);
        }
    } else {
        // Faltan parámetros requeridos en la solicitud
        $resultado = [
            'success' => false, 
            'mensaje' => "Faltan datos obligatorios: carrera, semestre, grupo o turno."
        ];
        error_log("Solicitud incompleta: " . print_r($datos, true));
    }

} catch (PDOException $e) {
    // Error al ejecutar la consulta en la base de datos
    $resultado['mensaje'] = "Error al buscar alumnos: problema con la base de datos. " . $e->getMessage();
    error_log("Excepción de PDO al buscar alumnos: " . $e->getMessage());
}

// Enviar la respuesta al cliente como JSON
echo json_encode($resultado);
