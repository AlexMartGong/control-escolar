<?php
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/HorarioDAO.php';

$objBD = new ConexionBD($DatosBD);
$objHoDAO = new HorarioDAO($objBD->Conectar());

$res = $objHoDAO->MostrarHorario();
?>

<div id="frmArea">
    <h2 class="mb-4">Horario</h2>

    <div class="row mb-3">
        <div class="col-12 text-end">
            <button type="button" class="btn" style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                    onclick="location.href='index.php';">
                <i class="fas fa-arrow-circle-left"></i> Regresar
            </button>
            <button type="button" class="btn" style="background-color: #009475; border-color: #009475; color: white;"
                    onclick="loadFormHorario('frmHorario','');">
                <i class="fas fa-plus-circle"></i> Agregar Horario
            </button>
        </div>
    </div>

    <table class="table table-hover table-responsive table-striped" id="tableHorario">
        <thead>
        <tr class="table-dark text-center">
            <th>Id horario</th>
            <th>No. Control</th>
            <th>Nombre del alumno</th>
            <th>Clave Carrera</th>
            <th>Carrera</th>
            <th>Clave Materia</th>
            <th>Materia</th>
            <th>Turno</th>
            <th>Estado</th>
            <th>Opciones</th>
        </tr>
        </thead>
        <tbody class="">
            <?php
            if ($res['estado'] == 'OK' && $res['filas'] > 0) {
                $cont = 1;
                foreach ($res['datos'] as $fila) {

                    // Definir la clase para la fila en base al estado
                    $rowClass = "table-success";

                    // Definir la clase para el badge de estado
                    $badgeClass = "bg-success";
                    switch ($fila['estado']) {
                        case 'Activo':
                            $badgeClass = "bg-success";
                            break;
                        case 'Inactivo':
                            $badgeClass = "bg-danger";
                            break;
                    }
            ?>
        <tr class="text-center">
            <td><?= $fila['clave_horario'] ?></td>
            <td><?= $fila['numero_de_control'] ?></td>
            <td><?= $fila['nombre_de_alumno'] ?></td>
            <td><?= $fila['clave_de_carrera'] ?></td>
            <td><?= $fila['nombre_de_carrera'] ?></td>
            <td><?= $fila['clave_de_materia'] ?></td>
            <td><?= $fila['nombre_de_materia'] ?></td>
            <td><?= $fila['turno'] ?></td>
            <td><span class="badge <?= $badgeClass ?>"><?= $fila['estado'] ?></span></td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="loadFormHorario('modHorario', '<?= $fila['clave_horario'] ?>');">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                    <label>
                        <select class="form-select form-select-sm btn-warning"
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="changeStatusHorario('<?= $fila['clave_horario'] ?>', this.value, '<?= $fila['estado'] ?>');">
                            <option disabled selected>Cambiar estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </label>
                </div>
            </td>
        </tr>
        <?php
                    $cont++;
                }
            }
            ?>
        </tbody>
    </table>
</div>
