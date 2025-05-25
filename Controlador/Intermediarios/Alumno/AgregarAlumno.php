<?php
// Archivo Intermediario para insertar un registro de un alumno.
// Este archivo procesa la solicitud para agregar un nuevo alumno, interactuando con la base de datos
// a través del DAO (Data Access Object) correspondiente.

require '../../../Modelo/BD/ConexionBD.php';       // Maneja la conexión a la base de datos.
require '../../../Modelo/BD/ModeloBD.php';         // Configuración de la base de datos.
require '../../../Modelo/DAOs/AlumnoDAO.php';      // Lógica para agregar un alumno a la base de datos.

// Decodificación del JSON recibido desde el cliente. Este paso convierte los datos del cliente en un objeto PHP.
$datos = json_decode(file_get_contents("php://input"));  // Recibimos los datos en formato JSON.

$resultado = ['estado' => 'Error'];  // Inicializamos la respuesta en caso de error.

$c = new ConexionBD($DatosBD);  // Configuración para la conexión a la base de datos.
$conexion = $c->Conectar();     // Establecemos la conexión a la base de datos.
$objDaoAlumno = new AlumnoDAO($conexion);  // Instanciamos el DAO de Alumno para interactuar con la base de datos.

try {
    // Verificamos si los datos recibidos no están vacíos. Si están completos, procesamos la solicitud.
    if (isset($datos)) {
        
        $resultado = $objDaoAlumno->AgregarAlumno($datos);  // Llamamos al método del DAO para agregar el alumno.
        
        // Dependiendo del resultado, modificamos la respuesta.
        if ($resultado['estado'] == "OK") {
            // Si la operación fue exitosa, preparamos la respuesta para el usuario y para el log.
            $resultado = [
                'estado' => 'OK',  // Indicamos que la operación fue exitosa.
                'mensaje' => $resultado['mensaje']  // Mensaje del DAO que describe el resultado de la operación.
            ];
            error_log("Alumno agregado correctamente con los datos: " . json_encode($datos));  // Registro en el log de éxito.
        } else {
            // Si ocurrió un error al agregar el alumno, se actualiza la respuesta con el error.
            $resultado = [
                'estado' => 'Error',  // Indicamos que hubo un error.
                'mensaje' => $resultado['mensaje']  // Mensaje de error del DAO.
            ];
            error_log("Error al agregar el alumno con los datos: " . json_encode($datos));  // Registro en el log de error.
        }
    } else {
        // Si no se recibieron datos o los datos están incompletos, respondemos con un mensaje adecuado.
        $resultado = ['mensaje' => "Error al agregar el alumno: Datos insuficientes."];
        error_log("Datos insuficientes para agregar el alumno.");  // Log de la falta de datos.
    }
} catch (PDOException $e) {
    // Capturamos cualquier error relacionado con la base de datos.
    $resultado['mensaje'] = "Error al agregar el alumno: problemas en la base de datos; " . $e->getMessage();
    error_log("Error en la base de datos: " . $e->getMessage());  // Registro del error en la base de datos.
}

// Enviamos la respuesta al cliente en formato JSON.
echo json_encode($resultado);  // Devuelve el resultado final (estado y mensaje) en formato JSON.
?>

