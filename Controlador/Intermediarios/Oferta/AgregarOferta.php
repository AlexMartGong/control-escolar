<?php 
//Intermediario para agregar Oferta
header('Content-Type: application/json');
//Se importan los archivos necesarios para que funcione
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/OfertaDAO.php';

$datos = json_decode(file_get_contents("php://input"));

$resultado = ['estado' => "ERROR"];

if ($datos) {
    $c = new ConexionBD($DatosBD);
    $conexion = $c->Conectar();
    $objDaoOferta = new OfertaDAO($conexion);

    if (is_array($datos)) {
        $exitos = 0;
        $errores = [];

        foreach ($datos as $oferta) {
            $res = $objDaoOferta->AgregarOferta($oferta);
            if ($res['estado'] === 'OK') {
                $exitos++;
            } else {
                $errores[] = $res['mensaje'];
            }
        }

        if ($exitos > 0 && count($errores) === 0) {
            $resultado = ['estado' => 'OK', 'mensaje' => "$exitos ofertas guardadas con éxito"];
        } else {
            $resultado = ['estado' => 'ERROR', 'mensaje' => "Errores al guardar: " . implode(" | ", $errores)];
        }

    } else {
        $resultado = $objDaoOferta->AgregarOferta($datos);
    }
}

echo json_encode($resultado);
?>
