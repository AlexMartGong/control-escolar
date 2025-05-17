<?php
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/OfertaDAO.php';

$objBD = new ConexionBD($DatosBD);
$objOfDAO = new OfertaDAO($objBD->Conectar());

$res = $objOfDAO->MostrarOferta();
?>

<div id="frmArea">
    <h2 class="mb-4">OFERTA</h2>

    <div class="row mb-3">
        <div class="col-12 text-end ">
            <button type="button" class="btn" style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                    onclick="location.href='index.php';">
                <i class="fas fa-arrow-circle-left"></i> Regresar
            </button>
            <button type="button" class="btn" style="background-color: #009475; border-color: #009475; color: white;"
                    onclick="loadFormOferta('frmOferta','')">
                <i class="fas fa-plus-circle"></i> Nueva oferta
            </button>
        </div>
    </div>

    <table class="table table-hover" id="tableOferta">
        <thead>
        <tr class="table-dark text-center">
            <th>ID Oferta</th>
            <th>Grado</th>
            <th>Grupo</th>
            <th>Turno</th>
            <th>Estado</th>
            <th>ID Materia</th>
            <th>Nombre Materia</th>
            <th>Hrs. Teoricas</th>
            <th>Hrs. Practicas</th>
            <th>Creditos</th>
            <th>No. Unidades</th>
            <th>ID Docente</th>
            <th>Nombre Docente</th>
            <th>Opciones</th>
        </tr>
        </thead>
        <tbody class="table-success">
        <?php
            if ($res['estado'] == 'OK' && $res['filas'] > 0) {
                $cont = 1;
                foreach ($res['datos'] as $fila) {

                    // Definir la clase para la fila en base al estado
                    $rowClass = "table-success";

                    // Definir la clase para el badge de estado
                    $badgeClass = "bg-success";
                    switch ($fila['estado']) {
                        case 'Asignada':
                            $badgeClass = "bg-success";
                            break;
                        case 'No asignada':
                            $badgeClass = "bg-danger";
                            break;
                    }
            ?>
        <tr class="">
                <td><?= $fila['clave_de_oferta'] ?></td>
                        <td><?= $fila['semestre'] ?></td>
                        <td><?= $fila['grupo'] ?></td>
                        <td><?= $fila['turno'] ?></td>
                        <td><span class="badge <?= $badgeClass ?>"><?= $fila['estado'] ?></span></td>
                        <td><?= $fila['clave_de_materia'] ?></td>
                        <td><?= $fila['nombre_de_materia'] ?></td>
                        <td><?= $fila['horas_teoricas'] ?></td>
                        <td><?= $fila['horas_practicas'] ?></td>
                        <td><?= $fila['creditos'] ?></td>
                        <td><?= $fila['unidades'] ?></td>
                        <td><?= $fila['clave_de_docente'] ?></td>
                        <td><?= $fila['docente'] ?></td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="loadFormOferta('modOferta','')">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                    <label>
                        <select class="form-select form-select-sm btn-warning"
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="changeStatusOferta('OF001', this.value, 'Matemáticas Básicas')">
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