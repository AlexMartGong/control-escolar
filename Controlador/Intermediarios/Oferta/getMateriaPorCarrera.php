<?php 
//Intermediario para obtner las materias por clave de carrera
header('Content-Type: application/json');
// Se importan los archivos necesarios para trabajar con la base de datos y el DAO de Oferta
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/OfertaDAO.php';

$datos = json_decode(file_get_contents("php://input"));

if ($datos && isset($datos->claveCarrera)) {
    $c = new ConexionBD($DatosBD);
    $conexion = $c->Conectar();

    if (!$conexion) {
        http_response_code(500);
        echo json_encode([]);
        exit;
    }

    $objDaoOferta = new OfertaDAO($conexion);
    $resultado = $objDaoOferta->BuscarMateriasporCarrera($datos->claveCarrera);

    if ($resultado['estado'] === 'OK' && isset($resultado['datos'])) {
        echo json_encode($resultado['datos']); 
    } else {
        echo json_encode([]);
    }
} else {
    echo json_encode([]);
}
?>
