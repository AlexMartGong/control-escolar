<?php
// Archivo Intermediario para gestionar la búsqueda y modificación de periodos

require '../../../Modelo/BD/ConexionBD.php';   // Conexión a la base de datos.
require '../../../Modelo/BD/ModeloBD.php';     // Configuración de la base de datos.
require '../../../Modelo/DAOs/PeriodoDAO.php'; // Operaciones relacionadas con Periodo.

$datos = json_decode(file_get_contents("php://input"), true);

// Inicializar la respuesta con estado de error
$resultado = ['estado' => 'Error'];

// Crear instancia de conexión y DAO
$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoPeriodo = new PeriodoDAO($conexion);

try {
    if (isset($datos['buscar']) && $datos['buscar'] === true) {
        // **Búsqueda de período**
        $tipo = isset($datos['id']) ? 'id' : 'nombre';
        $valor = $datos[$tipo];

        $resultado = $objDaoPeriodo->BuscarPeriodo($tipo, $valor);
        if (!$resultado) {
            $resultado = ['estado' => 'Error', 'mensaje' => "No se encontró el periodo."];
        }
    } elseif (isset($datos['guardar']) && $datos['guardar'] === true) {
        // **Modificar período**
        if (
            isset($datos['idPeriodo'], $datos['periodo'], $datos['fechaInicio'], 
                  $datos['fechaTermino'], $datos['fechaInicioAjustes'], $datos['fechaTerminoAjustes'])
        ) {
            $resultado = $objDaoPeriodo->ModificarPeriodo(
                $datos['idPeriodo'], 
                $datos['periodo'], 
                $datos['fechaInicio'], 
                $datos['fechaTermino'], 
                $datos['fechaInicioAjustes'], 
                $datos['fechaTerminoAjustes']
            );

            if ($resultado) {
                $resultado = ['success' => true, 'mensaje' => "El período se ha actualizado correctamente."];
            } else {
                $resultado = ['success' => false, 'mensaje' => "No se pudo actualizar el periodo."];
            }
        } else {
            $resultado = ['success' => false, 'mensaje' => "Datos insuficientes."];
        }
    } else {
        $resultado['mensaje'] = "Solicitud inválida.";
    }
} catch (PDOException $e) {
    $resultado['mensaje'] = "Error en la base de datos: " . $e->getMessage();
}

// Enviar la respuesta en formato JSON
echo json_encode($resultado);
?>
