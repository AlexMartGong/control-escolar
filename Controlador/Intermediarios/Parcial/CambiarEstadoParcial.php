<?php
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';

header('Content-Type: application/json');

try {
    // 1) Lee JSON o form-data
    $raw = file_get_contents('php://input');
    $in  = json_decode($raw ?: "{}", true);
    if (!is_array($in)) $in = [];
    $id     = isset($in['id']) ? (int)$in['id'] : (isset($_POST['id']) ? (int)$_POST['id'] : 0);
    $status = isset($in['status']) ? (string)$in['status'] : (isset($_POST['status']) ? (string)$_POST['status'] : '');

    if ($id <= 0) {
        echo json_encode(['estado'=>'Error','mensaje'=>'ID de parcial inválido.']); exit;
    }

    // 2) Normaliza estados a lo que acepta el SP
    $mapa = [
        'abierto'   => 'Abierto',
        'activo'    => 'Abierto',
        'pendiente' => 'Pendiente',
        'cerrado'   => 'Cerrado',
        'cancelado' => 'Cancelado',
    ];
    $estado = $mapa[strtolower(trim($status))] ?? 'Pendiente';

    // 3) Conexión PDO
    $c = new ConexionBD($DatosBD);
    $pdo = $c->Conectar();
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 4) Prepara la variable OUT y llama el SP EXACTO:
    //    spModificarEstadoParcial(IN pidParcial, IN pestado, OUT mensaje)
    $pdo->exec("SET @mensaje := ''");

    $stmt = $pdo->prepare("CALL spModificarEstadoParcial(:pid, :pestado, @mensaje)");
    $stmt->bindValue(':pid', $id, PDO::PARAM_INT);
    $stmt->bindValue(':pestado', $estado, PDO::PARAM_STR);
    $stmt->execute();

    // drenar cualquier resultset para evitar "commands out of sync"
    do { $stmt->fetchAll(); } while ($stmt->nextRowset());
    $stmt->closeCursor();

    // 5) Lee el OUT
    $row = $pdo->query("SELECT @mensaje AS mensaje")->fetch(PDO::FETCH_ASSOC);
    $msg = $row && isset($row['mensaje']) ? (string)$row['mensaje'] : '';

    // 6) Interpreta la respuesta del SP
    $ml = mb_strtolower($msg, 'UTF-8');

    if (strpos($ml, 'estado: exito') !== false || strpos($ml, 'estado: éxito') !== false) {
        echo json_encode(['estado'=>'OK','mensaje'=>$msg !== '' ? $msg : 'Estado actualizado.']); exit;
    }
    if (strpos($ml, 'estado: sin cambios') !== false) {
        echo json_encode(['estado'=>'OK','mensaje'=>$msg !== '' ? $msg : 'Estado: Sin cambios']); exit;
    }
    if (strpos($ml, 'error:') !== false) {
        echo json_encode(['estado'=>'Error','mensaje'=>$msg]); exit;
    }

    // fallback si el SP no devolvió nada claro
    echo json_encode(['estado'=>'Error','mensaje'=> ($msg !== '' ? $msg : 'Error al cambiar el estado del parcial')]);

} catch (Throwable $e) {
    // Devuelve el error real para depurar; si no quieres mostrarlo, cámbialo por un genérico
    echo json_encode(['estado'=>'Error','mensaje'=>'Error al realizar la operación: '.$e->getMessage()]);
}
