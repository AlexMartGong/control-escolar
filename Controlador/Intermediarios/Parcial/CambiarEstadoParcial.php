<?php
// Archivo intermediario que recibe una solicitud del cliente para cambiar el estado de una parcial,
// procesa los datos y llama al método del modelo que realiza la actualización en la base de datos.

// Importación de archivos necesarios para la conexión y la lógica de base de datos.
require '../../../Modelo/BD/ConexionBD.php';         // Manejo de la conexión a la base de datos.
require '../../../Modelo/BD/ModeloBD.php';          // Configuración de la base de datos.
require '../../../Modelo/DAOs/ParcialDAO.php';     // Contiene la lógica para cambiar el estado de unparcial.

header('Content-Type: application/json; charset=utf-8');

// Decodificación robusta del JSON
$raw = file_get_contents("php://input");
if ($raw === false || $raw === '') {
    echo json_encode(['estado' => 'Error', 'mensaje' => 'Solicitud vacía.']);
    exit;
}

$datos = json_decode($raw);
if ($datos === null && json_last_error() !== JSON_ERROR_NONE) {
    error_log("JSON inválido: " . json_last_error_msg() . " | RAW: " . $raw);
    echo json_encode(['estado' => 'Error', 'mensaje' => 'JSON inválido en la solicitud.']);
    exit;
}

// Validaciones mínimas y mapeo seguro
$id = isset($datos->id) ? $datos->id : null;
if ($id === null || !is_numeric($id)) {
    echo json_encode(['estado' => 'Error', 'mensaje' => 'Falta o es inválido el id.']);
    exit;
}

$validos = ['Abierto', 'Cerrado', 'Cancelado', 'Pendiente'];
$status  = isset($datos->status) ? (string)$datos->status : 'Pendiente';
$pestado = in_array($status, $validos, true) ? $status : 'Pendiente';

// Objeto limpio para el DAO
$payload = (object)[
    'pclave'  => (int)$id,
    'pestado' => $pestado
];

// Respuesta por defecto
$resultado = ['estado' => 'Error'];


// Instanciamos la clase de conexión a la base de datos y el DAO de Parcial.
$c = new ConexionBD($DatosBD);  // Se pasa la configuración de la base de datos.
$conexion = $c->Conectar();     // Establecemos la conexión con la base de datos.
$objDaoParcial = new ParcialDAO($conexion);  // Instanciamos el DAO de Parcial para acceder a los métodos relacionados.

try {
    // Log para indicar que estamos procesando los parámetros de la solicitud.
    error_log("Comprobando parámetros de la solicitud...");

    if (isset($payload)) {
        // Verificamos si los datos están completos. Si es así, pasamos a cambiar el estado del parcial.
        error_log("CambiarEstadoParcial payload => id={$payload->pclave}, estado={$payload->pestado}");
        $resultado = $objDaoParcial->CambiarEstadoParcial($payload);  // Llamamos al método del DAO para cambiar el estado del parcial.

        // Dependiendo del resultado de la operación, se ajusta la respuesta.
        if ($resultado['estado'] == "OK") {
            // Si la operación fue exitosa, preparamos la respuesta para el usuario y registramos el éxito.
            $resultado = [
                'estado' => 'OK',  // Indicamos que la operación fue exitosa.
                'mensaje' => $resultado['mensaje']  // Mensaje del DAO con el resultado de la operación.
            ];
            error_log("Estado actualizado correctamente para el parcial con ID: " . $payload->pclave);  // Registro en el log de éxito.
        } else {
            // Si ocurrió un error al cambiar el estado de la parcial, preparamos la respuesta de error.
            $resultado = [
                'estado' => 'Error',  // Indicamos que hubo un error en la operación.
                'mensaje' => $resultado['mensaje']  // Mensaje de error proporcionado por el DAO.
            ];
            error_log("Error al cambiar el estado del parcial con ID: " . $payload->pclave);  // Registro en el log de error.
        }
    } else {
        // Si no se recibieron los datos o los datos están incompletos, respondemos con un mensaje adecuado.
        $resultado = ['mensaje' => "No pudimos completar la acción en este momento. Intente de nuevo en unos minutos."];  // Respuesta para el cliente.
        error_log("Datos incompletos para cambiar estado del parcial. Datos recibidos: " . $payload);  // Log para indicar falta de datos.
    }
} catch (PDOException $e) {
   } catch (PDOException $e) {
    error_log("PDOException: " . $e->getMessage());
    // DEV: muestra más detalle por ahora
    $resultado['mensaje'] = "DB: " . $e->getMessage();
}

// Enviamos la respuesta al cliente en formato JSON, para que pueda procesarla adecuadamente.
echo json_encode($resultado);  // Devuelve el resultado final (estado y mensaje) en formato JSON.
?>