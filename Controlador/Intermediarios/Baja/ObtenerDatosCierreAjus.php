<?php
// Intermediario para manejar solicitudes de búsqueda de alumnos con el estado 'Baja Temporal', 'Baja' o 'Baja Definitiva'
// y el periodo abierto.
// Recibe datos desde el cliente, procesa la solicitud y delega la lógica al DAO correspondiente.

// Importar clases necesarias para conexión y manejo de la base de datos.
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/BajaDAO.php';
require '../../../Modelo/DAOs/PeriodoDAO.php'; 

header('Content-Type: application/json'); 

$datos = json_decode(file_get_contents("php://input"));
$estadoP = $datos->estadoP ?? 'Abierto'; // Valor por defecto

$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();

// DAO de alumnos y periodos
$objDaoBaja= new BajaDAO($pdo);
$objDaoPeriodo = new PeriodoDAO($pdo);

try {

    $validacion = $objDaoBaja->ValidarCierreDeAjustes();

    if ($validacion['estado'] === 'Error') {
        // Si no es posible, devolvemos el error y detenemos
        echo json_encode([
            'estado' => 'Error',
            'mensaje' => $validacion['mensaje']
        ]);
        exit;
    }

    $resultadoBajas = $objDaoBaja->ObtenerBajasPorEjecutar();
    $resultadoPeriodo = $objDaoPeriodo->BuscarPeriodoPorEstado($estadoP);

    $resultado = [
        'estado' => $resultadoBajas['estado'],
        'datosBajas' => $resultadoBajas['datos'] ?? [],
        'periodo' => $resultadoPeriodo['datos'][0] ?? 'No hay un periodo en estado "Abierto".'
    ];

    if ($resultadoBajas['estado'] !== 'OK') {
        $resultado['mensaje'] = $resultadoBajas['mensaje'] ?? 'No hay datos disponibles.';
    }

} catch(PDOException $e) {
    $resultado = [
        'mensaje' => "Error al obtener los datos para el cierre de ajustes . " . $e->getMessage()
    ];
    error_log("Excepción PDO en intermediario Datos de Cierre: " . $e->getMessage());
}

echo json_encode($resultado);
?>