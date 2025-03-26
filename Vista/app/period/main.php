<?php

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/PeriodoDAO.php';

$objBD = new ConexionBD($DatosBD);
$objPeDAO = new PeriodoDAO($objBD->Conectar());

$res = $objPeDAO->MostrarPeriodos();

?>

<h3 class="mb-4">PERIODO</h3>

<div class="row mb-3">
    <div class="col-12 text-end ">
        <button type="button" class="btn" style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                onclick="location.href='index.php';">
            <i class="fas fa-arrow-circle-left"></i> Regresar
        </button>
        <button type="button" class="btn" style="background-color: #009475; border-color: #009475; color: white;"
                onclick="option('period-add', ''); obtenerPeriodo();">
            <i class="fas fa-plus-circle"></i> Nuevo Periodo
        </button>
    </div>
</div>

<div class="row">
    <div class="col-12">
        <div id="frmArea"></div>
    </div>
</div>

<table class="table table-hover" id="tablePeriod">
    <thead>
    <tr class="table-dark">
        <th>ID Periodo</th>
        <th>Periodo</th>
        <th>Fecha de inicio</th>
        <th>Fecha de termino</th>
        <th>Fecha de inicio de ajustes</th>
        <th>Fecha de termino de ajustes</th>
        <th>Estado</th>
        <th>Opciones</th>
    </tr>
    </thead>
    <tbody>

    <?php
    if ($res['estado'] == 'OK' && $res['filas'] > 0) {
        $cont = 1;
        foreach ($res['datos'] as $fila) {
            // Definir la clase para la fila en base al estado
            $rowClass = "table-success";

            // Definir la clase para el badge de estado
            $badgeClass = "bg-success";
            switch ($fila['estado']) {
                case 'Pendiente':
                    $badgeClass = "bg-warning text-dark";
                    break;
                case 'Abierto':
                    $badgeClass = "bg-success";
                    break;
                case 'Cerrado':
                    $badgeClass = "bg-secondary";
                    break;
                case 'Cancelado':
                    $badgeClass = "bg-danger";
                    break;
            }
            ?>

            <tr class="<?= $rowClass ?>">
                <td><?= $fila['clave_periodo'] ?></td>
                <td><?= $fila['periodo'] ?></td>
                <td><?= $fila['fecha_de_inicio'] ?></td>
                <td><?= $fila['fecha_de_termino'] ?></td>
                <td><?= $fila['fecha_de_inicio_ajustes'] ?></td>
                <td><?= $fila['fecha_de_termino_ajustes'] ?></td>
                <td><span class="badge <?= $badgeClass ?>"><?= $fila['estado'] ?></span></td>
                <td>
                    <div class="d-flex gap-2">
                        <?php if ($fila['estado'] === 'Abierto' || $fila['estado'] === 'Pendiente') : ?>
                            <button onclick="option('period-edit', <?= $fila['clave_periodo'] ?>)"
                                    class="btn btn-outline-primary" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                        <?php else : ?>
                            <button class="btn btn-outline-secondary" title="No editable" disabled>
                                <i class="fas fa-edit"></i>
                            </button>
                        <?php endif; ?>

                        <label>
                            <select class="form-select form-select-sm btn-warning"
                                    style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                    onchange="changeStatus('<?= $fila['clave_periodo'] ?>', this.value, '<?= $fila['estado'] ?>')">
                                <option disabled selected>Cambiar estado</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Abierto">Abierto</option>
                                <option value="Cerrado">Cerrado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                        </label>
                    </div>
                </td>
            </tr>

            <?php
            $cont++;
        }
    } else {
        echo("<tr><td colspan='8'>Sin resultados para mostrar</td></tr>");
    }
    ?>

    </tbody>
</table>

