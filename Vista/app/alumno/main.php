<?php
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/AlumnoDAO.php';

$objBD = new ConexionBD($DatosBD);
$objAlDAO = new AlumnoDAO($objBD->Conectar());

$res = $objAlDAO->MostrarAlumno();
?>

<div id="frmArea">
    <h2 class="mb-4">Alumnos</h2>

    <div class="row mb-3">
        <div class="col-12 text-end">
            <button type="button" class="btn" style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                    onclick="location.href='index.php';">
                <i class="fas fa-arrow-circle-left"></i> Regresar
            </button>
            <button type="button" class="btn" style="background-color: #009475; border-color: #009475; color: white;"
                    onclick="loadFormAlumno('frmalumno','');">
                <i class="fas fa-plus-circle"></i> Agregar alumno
            </button>
        </div>
    </div>

    <table class="table table-hover table-responsive table-striped" id="tableAlumnos">
        <thead>
        <tr class="table-dark text-center">
            <th>noControl</th>
            <th>Nombre</th>
            <th>Genero</th>
            <th>Semestre</th>
            <th>Grupo</th>
            <th>turno</th>
            <th>Periodos en baja</th>
            <th>Nombre de Carrera</th>
            <th>Clave Carrera</th>
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
                        case 'Baja':
                            $badgeClass = "bg-danger";
                            break;
                        case 'Baja Definitiva':
                            $badgeClass = "bg-danger";
                            break;
                        case 'Baja Temporal':
                            $badgeClass = "bg-danger";
                            break;
                    }
            ?>
        <tr class="text-center">
            <td><?= $fila['numero_de_control'] ?></td>
            <td><?= $fila['nombre_de_alumno'] ?></td>
            <td><?= $fila['genero'] ?></td>
            <td><?= $fila['semestre'] ?></td>
            <td><?= $fila['grupo'] ?></td>
            <td><?= $fila['turno'] ?></td>
            <td><?= $fila['periodos_en_baja'] ?></td>
            <td><?= $fila['nombre_de_carrera'] ?></td>
            <td><?= $fila['clave_de_carrera'] ?></td>
            <td><span class="badge <?= $badgeClass ?>"><?= $fila['estado'] ?></span></td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="loadFormAlumno('modalumno', '<?= $fila['numero_de_control'] ?>')">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                    <label>
                        <select class="form-select form-select-sm btn-warning"
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="changeStatusAlumno('<?= $fila['numero_de_control'] ?>', this.value, '<?= $fila['estado'] ?>')">
                            <option disabled selected>Cambiar estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Baja Temporal">Baja Temporal</option>
                            <option value="Baja">Baja</option>
                            <option value="Baja Definitiva">Baja Definitiva</option>
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

