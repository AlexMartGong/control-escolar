<?php
// Intermediario para manejar solicitudes de búsqueda de alumnos con el estado 'Baja Temporal', 'Baja' o 'Baja Definitiva'
// y el periodo abierto.
// Recibe datos desde el cliente, procesa la solicitud y delega la lógica al DAO correspondiente.

// Importar clases necesarias para conexión y manejo de la base de datos.
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/AlumnoDAO.php';
require '../../../Modelo/DAOs/PeriodoDAO.php'; 

header('Content-Type: application/json'); 

$datos = json_decode(file_get_contents("php://input"));
$estadoP = $datos->estadoP ?? 'Abierto'; // Valor por defecto

$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();

// DAO de alumnos y periodos
$objDaoAlumno = new AlumnoDAO($pdo);
$objDaoPeriodo = new PeriodoDAO($pdo);

try {
    // Alumnos filtrados
    $resultadoAlumnos = $objDaoAlumno->ObtenerAlumnosFiltrados();

    // Periodo activo
    $resultadoPeriodo = $objDaoPeriodo->BuscarPeriodoPorEstado($estadoP);

    // Combinar resultados
    $resultado = [
        'estado' => 'OK',
        'datosAlumnos' => $resultadoAlumnos['datos'] ?? [],
        'filasAlumnos' => $resultadoAlumnos['filas'] ?? 0,
        'periodo' => $resultadoPeriodo['datos'][0]['periodo'] ?? 'N/D', // nombre del periodo
    ];

    // Si no hay alumnos filtrados, todo es 0
    if (!isset($resultadoAlumnos['datos']) || count($resultadoAlumnos['datos']) === 0) {
        $resultado['filasAlumnos'] = 0;
        $resultado['datosAlumnos'] = [];
    }

} catch(PDOException $e) {
    $resultado = [
        'estado' => 'Error',
        'mensaje' => "No fue posible completar la operación. " . $e->getMessage()
    ];
    error_log("Excepción PDO en intermediario Datos de Cierre: " . $e->getMessage());
}

echo json_encode($resultado);
?>