<?php
// Archivo intermediario que recibe una solicitud del cliente para cambiar el estado de un Horario,
// procesa los datos y llama al método del modelo que realiza la actualización en la base de datos.

// Importación de archivos necesarios para la conexión y la lógica de base de datos.
require '../../../Modelo/BD/ConexionBD.php';         
require '../../../Modelo/BD/ModeloBD.php';          
require '../../../Modelo/DAOs/HorarioDAO.php';     

// Decodificación del JSON recibido desde el cliente. Convierte los datos en un objeto PHP.
$datos = json_decode(file_get_contents("php://input"));  

// Respuesta predeterminada en caso de error. Inicializamos la respuesta en un estado de error.
$resultado = ['estado' => 'Error'];  

// Mapeo de los campos recibidos. Aquí se ajustan los nombres de las propiedades para ser utilizados en la consulta.
$datos->pid = $datos->id ?? null;
$datos->pestado = $datos->status ?? null;

// Instanciamos la clase de conexión a la base de datos y el DAO de Horario.
$c = new ConexionBD($DatosBD);  
$conexion = $c->Conectar();     
$objDaoHorario = new HorarioDAO($conexion);  

try {
   
    if (isset($datos)) {
        // Verificamos si los datos están completos. Si es así, pasamos a cambiar el estado del horario.
        $resultado = $objDaoHorario->CambiarEstadoHorarios($datos);  

        // Dependiendo del resultado de la operación, se ajusta la respuesta.
        if ($resultado['estado'] == "OK") {
            // Si la operación fue exitosa, preparamos la respuesta para el usuario y registramos el éxito.
            $resultado = [
                'estado' => 'OK',  
                'mensaje' => $resultado['mensaje']  
            ];
            
        } else {
            // Si ocurrió un error al cambiar el estado del horario, preparamos la respuesta de error.
            $resultado = [
                'estado' => 'Error',  
                'mensaje' => $resultado['mensaje'] 
            ];
            error_log("Error al cambiar el estado del horario con ID: " . $datos->pid);  
        }
    } else {
        // Si no se recibieron los datos o los datos están incompletos, respondemos con un mensaje adecuado.
        $resultado = ['mensaje' => "No pudimos completar la acción en este momento. Intente de nuevo en unos minutos."];  
        error_log("Datos incompletos para cambiar estado del horario. Datos recibidos: " . $datos);  
    }
} catch (PDOException $e) {
    // Capturamos cualquier error relacionado con la base de datos y lo registramos.
    $resultado['mensaje'] = "Ocurrió un problema al comunicarse con la base de datos. Por favor, intente nuevamente más tarde." . $e->getMessage();
    error_log("Excepción PDO al cambiar estado del horario: " . $e->getMessage());  
}

// Enviamos la respuesta al cliente en formato JSON, para que pueda procesarla adecuadamente.
echo json_encode($resultado);  
?>