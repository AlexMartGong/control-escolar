<?php
// Archivo intermediario que recibe una solicitud del cliente para cambiar el estado de una oferta,
// procesa los datos y llama al método del modelo que realiza la actualización en la base de datos.

// Importación de archivos necesarios para la conexión y la lógica de base de datos.
require '../../../Modelo/BD/ConexionBD.php';         // Manejo de la conexión a la base de datos.
require '../../../Modelo/BD/ModeloBD.php';          // Configuración de la base de datos.
require '../../../Modelo/DAOs/AlumnoDAO.php';     // Contiene la lógica para cambiar el estado de un alumno.

// Decodificación del JSON recibido desde el cliente. Convierte los datos en un objeto PHP.
$datos = json_decode(file_get_contents("php://input"));  // Recibimos los datos en formato JSON.

// Respuesta predeterminada en caso de error. Inicializamos la respuesta en un estado de error.
$resultado = ['estado' => 'Error'];  // Definimos la estructura de la respuesta.

// Mapeo de los campos recibidos. Aquí se ajustan los nombres de las propiedades para ser utilizados en la consulta.
$datos->pclave = $datos->id ?? null;  // Asignamos el valor de 'id' a 'pclave', asegurándonos de que no sea nulo.
$datos->pestado = ($datos->status === "Activo") ? "Activo" :
                  (($datos->status === "Baja Temporal") ? "Baja Temporal" :
                  (($datos->status === "Baja") ? "Baja" : "Baja Definitiva"));
                  
// Instanciamos la clase de conexión a la base de datos y el DAO de Alumno.
$c = new ConexionBD($DatosBD);  // Se pasa la configuración de la base de datos.
$conexion = $c->Conectar();     // Establecemos la conexión con la base de datos.
$objDaoAlumno = new AlumnoDAO($conexion);  // Instanciamos el DAO de Alumno para acceder a los métodos relacionados.

try {
    // Log para indicar que estamos procesando los parámetros de la solicitud.
    error_log("Comprobando parámetros de la solicitud...");

    if (isset($datos)) {
        // Verificamos si los datos están completos. Si es así, pasamos a cambiar el estado de la oferta.
        $resultado = $objDaoAlumno->CambiarEstadoAlumno($datos);  // Llamamos al método del DAO para cambiar el estado del alumno.

        // Dependiendo del resultado de la operación, se ajusta la respuesta.
        if ($resultado['estado'] == "OK") {
            // Si la operación fue exitosa, preparamos la respuesta para el usuario y registramos el éxito.
            $resultado = [
                'estado' => 'OK',  // Indicamos que la operación fue exitosa.
                'mensaje' => $resultado['mensaje']  // Mensaje del DAO con el resultado de la operación.
            ];
            error_log("Estado actualizado correctamente para el alumno con ID: " . $datos->pclave);  // Registro en el log de éxito.
        } else {
            // Si ocurrió un error al cambiar el estado del alumno, preparamos la respuesta de error.
            $resultado = [
                'estado' => 'Error',  // Indicamos que hubo un error en la operación.
                'mensaje' => $resultado['mensaje']  // Mensaje de error proporcionado por el DAO.
            ];
            error_log("Error al cambiar el estado del alumno con ID: " . $datos->pclave);  // Registro en el log de error.
        }
    } else {
        // Si no se recibieron los datos o los datos están incompletos, respondemos con un mensaje adecuado.
        $resultado = ['mensaje' => "No pudimos completar la acción en este momento. Intente de nuevo en unos minutos."];  // Respuesta para el cliente.
        error_log("Datos incompletos para cambiar estado del alumno. Datos recibidos: " . $datos);  // Log para indicar falta de datos.
    }
} catch (PDOException $e) {
    // Capturamos cualquier error relacionado con la base de datos y lo registramos.
    $resultado['mensaje'] = "Ocurrió un problema al comunicarse con la base de datos. Por favor, intente nuevamente más tarde." . $e->getMessage();
    error_log("Excepción PDO al cambiar estado del alumno: " . $e->getMessage());  // Registro detallado del error en la base de datos.
}

// Enviamos la respuesta al cliente en formato JSON, para que pueda procesarla adecuadamente.
echo json_encode($resultado);  // Devuelve el resultado final (estado y mensaje) en formato JSON.
?>