<?php
// Archivo Intermediario para gestionar la búsqueda y modificación de Materias.
// Este archivo maneja la lógica para cambiar el estado de una materia en la base de datos,
// interactuando con el DAO correspondiente para realizar la operación solicitada.

// Importación de archivos necesarios para la conexión y la lógica de base de datos.
require '../../../Modelo/BD/ConexionBD.php';         // Manejo de la conexión a la base de datos.
require '../../../Modelo/BD/ModeloBD.php';          // Configuración de la base de datos.
require '../../../Modelo/DAOs/MateriaDAO.php';     // Contiene la lógica para cambiar el estado de una materia.

// Decodificación del JSON recibido desde el cliente. Convierte los datos en un objeto PHP.
$datos = json_decode(file_get_contents("php://input"));  // Recibimos los datos en formato JSON.

// Respuesta predeterminada en caso de error. Inicializamos la respuesta en un estado de error.
$resultado = ['estado' => 'Error'];  // Definimos la estructura de la respuesta.

// Mapeo de los campos recibidos. Aquí se ajustan los nombres de las propiedades para ser utilizados en la consulta.
$datos->pclave = $datos->id ?? null;  // Asignamos el valor de 'id' a 'pclave', asegurándonos de que no sea nulo.
$datos->pestado = $datos->status === "Activo" ? "Activo" : "Inactivo";  // Verificamos y asignamos el estado de la materia.

// Instanciamos la clase de conexión a la base de datos y el DAO de Materia.
$c = new ConexionBD($DatosBD);  // Se pasa la configuración de la base de datos.
$conexion = $c->Conectar();     // Establecemos la conexión con la base de datos.
$objDaoMateria = new MateriaDAO($conexion);  // Instanciamos el DAO de Materia para acceder a los métodos relacionados.

try {
    // Log para indicar que estamos procesando los parámetros de la solicitud.
    error_log("Comprobando parámetros de la solicitud...");

    if (isset($datos)) {
        // Verificamos si los datos están completos. Si es así, pasamos a cambiar el estado de la materia.
        $resultado = $objDaoMateria->CambiarEstadoMaterias($datos);  // Llamamos al método del DAO para cambiar el estado de la materia.

        // Dependiendo del resultado de la operación, se ajusta la respuesta.
        if ($resultado['estado'] == "OK") {
            // Si la operación fue exitosa, preparamos la respuesta para el usuario y registramos el éxito.
            $resultado = [
                'estado' => 'OK',  // Indicamos que la operación fue exitosa.
                'mensaje' => $resultado['mensaje']  // Mensaje del DAO con el resultado de la operación.
            ];
            error_log("Estado actualizado correctamente para la materia con ID: " . $datos->pclave);  // Registro en el log de éxito.
        } else {
            // Si ocurrió un error al cambiar el estado de la materia, preparamos la respuesta de error.
            $resultado = [
                'estado' => 'Error',  // Indicamos que hubo un error en la operación.
                'mensaje' => $resultado['mensaje']  // Mensaje de error proporcionado por el DAO.
            ];
            error_log("Error al cambiar el estado de la materia con ID: " . $datos->pclave);  // Registro en el log de error.
        }
    } else {
        // Si no se recibieron los datos o los datos están incompletos, respondemos con un mensaje adecuado.
        $resultado = ['mensaje' => "Error al cambiar el estado de la materia: Datos insuficientes."];  // Respuesta para el cliente.
        error_log("Datos insuficientes para cambiar el estado de la materia.");  // Log para indicar falta de datos.
    }
} catch (PDOException $e) {
    // Capturamos cualquier error relacionado con la base de datos y lo registramos.
    $resultado['mensaje'] = "Error Modificar Materia: problemas en la base de datos; " . $e->getMessage();
    error_log("Error en la base de datos: " . $e->getMessage());  // Registro detallado del error en la base de datos.
}

// Enviamos la respuesta al cliente en formato JSON, para que pueda procesarla adecuadamente.
echo json_encode($resultado);  // Devuelve el resultado final (estado y mensaje) en formato JSON.
?>
