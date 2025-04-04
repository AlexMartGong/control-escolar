<?php

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/DocenteDAO.php';

$objBD = new ConexionBD($DatosBD);
$objDoDAO = new DocenteDAO($objBD->Conectar());

$res = $objDoDAO->MostrarDocente();

?>

<div id="frmArea">
    <h2 class="mb-4">DOCENTE</h2>

    <div class="row mb-3">
        <div class="col-12 text-end ">
            <button type="button" class="btn" style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                    onclick="location.href='index.php';">
                <i class="fas fa-arrow-circle-left"></i> Regresar
            </button>
            <button type="button" class="btn" style="background-color: #009475; border-color: #009475; color: white;"
                    onclick="loadFormJDocente('frmDocente','');">
                <i class="fas fa-plus-circle"></i> Nuevo Docente
            </button>
        </div>
    </div>

    <table class="table table-hover" id="tableDocente">
        <thead>
        <tr class="table-dark text-center">
            <th>ID Docente</th>
            <th>Nombre</th>
            <th>Perfil</th>
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
                        case 'Activo':
                            $badgeClass = "bg-success";
                            break;
                        case 'Inactivo':
                            $badgeClass = "bg-danger";
                            break;
                    }
            ?>

                    <tr class="<?= $rowClass ?>">
                        <td><?= $fila['clave_de_docente'] ?></td>
                        <td><?= $fila['docente'] ?></td>
                        <td><?= $fila['perfil_de_docente'] ?></td>
                        <td><span class="badge <?= $badgeClass ?>"><?= $fila['estado'] ?></span></td>
                        <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="loadFormJDocente('modDocente','');">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                    <label>
                        <select class="form-select form-select-sm btn-warning"
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="changeStatusDocente(1, this.value, 'Activo');">
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