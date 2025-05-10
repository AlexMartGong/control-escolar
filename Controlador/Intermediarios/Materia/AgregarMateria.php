<?php
// Archivo Intermediario para insertar un registro de una materia.
// Este archivo procesa la solicitud para agregar una nueva materia, interactuando con la base de datos
// a través del DAO (Data Access Object) correspondiente.

// Importación de archivos necesarios para la conexión y lógica de base de datos.
require '../../../Modelo/BD/ConexionBD.php';       // Maneja la conexión a la base de datos.
require '../../../Modelo/BD/ModeloBD.php';         // Configuración de la base de datos.
require '../../../Modelo/DAOs/MateriaDAO.php';     // Lógica para agregar una materia a la base de datos.

// Decodificación del JSON recibido desde el cliente. Este paso convierte los datos en un objeto PHP.
$datos = json_decode(file_get_contents("php://input"));  // Recibimos los datos en formato JSON.

// Respuesta predeterminada que se enviará si ocurre un error en el proceso.
$resultado = ['estado' => 'Error'];  // Inicializamos la respuesta en caso de error.

// Instanciamos la clase de conexión y el DAO de Materia.
$c = new ConexionBD($DatosBD);  // Configuración para la conexión a la base de datos.
$conexion = $c->Conectar();     // Establecemos la conexión a la base de datos.
$objDaoMateria = new MateriaDAO($conexion);  // Instanciamos el DAO de Materia para interactuar con la base de datos.

try {
    if (isset($datos)) {
        // Verificamos si los datos recibidos no están vacíos. Si están completos, procesamos la solicitud.
        $resultado = $objDaoMateria->AgregarMaterias($datos);  // Llamamos al método del DAO para agregar la materia.
        
        // Dependiendo del resultado, modificamos la respuesta.
        if ($resultado['estado'] == "OK") {
            // Si la operación fue exitosa, preparamos la respuesta para el usuario y para el log.
            $resultado = [
                'estado' => 'OK',  // Indicamos que la operación fue exitosa.
                'mensaje' => $resultado['mensaje']  // Mensaje del DAO que describe el resultado de la operación.
            ];
            error_log("Materia agregada correctamente con los datos: " . json_encode($datos));  // Registro en el log de éxito.
        } else {
            // Si ocurrió un error al agregar la materia, se actualiza la respuesta con el error.
            $resultado = [
                'estado' => 'Error',  // Indicamos que hubo un error.
                'mensaje' => $resultado['mensaje']  // Mensaje de error del DAO.
            ];
            error_log("Error al agregar la materia con los datos: " . json_encode($datos));  // Registro en el log de error.
        }
    } else {
        // Si no se recibieron datos o los datos están incompletos, respondemos con un mensaje adecuado.
        $resultado = ['mensaje' => "Error al agregar la materia: Datos insuficientes."];
        error_log("Datos insuficientes para agregar la materia.");  // Log de la falta de datos.
    }
} catch (PDOException $e) {
    // Capturamos cualquier error relacionado con la base de datos.
    $resultado['mensaje'] = "Error al modificar la carrera: problemas en la base de datos; " . $e->getMessage();
    error_log("Error en la base de datos: " . $e->getMessage());  // Registro del error en la base de datos.
}

// Enviamos la respuesta al cliente en formato JSON.
echo json_encode($resultado);  // Devuelve el resultado final (estado y mensaje) en formato JSON.
?>



