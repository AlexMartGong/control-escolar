<?php

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/BajaDAO.php';

$objBD = new ConexionBD($DatosBD);
$objBaDAO = new BajaDAO($objBD->Conectar());

$res = $objBaDAO->MostrarBajas();

?>

<div id="frmArea">
    <h2 class="mb-4">Bajas</h2>

    <div class="row mb-3">
        <div class="col-12 d-flex flex-wrap justify-content-center justify-content-md-end gap-2">
            <!-- Botón regresar -->
            <button type="button" class="btn"
                style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                onclick="location.href='index.php';">
                <i class="fas fa-arrow-circle-left"></i> Regresar
            </button>

            <!-- Botón agregar baja manual -->
            <button type="button" class="btn"
                style="background-color: #009475; color: white;"
                onclick="loadFormBajaAlumnos('bajaManual', '')">
                <i class="fas fa-plus-circle"></i> Agregar baja manual
            </button>

            <!-- Botón baja por no inscripción -->
            <button type="button" class="btn btn-warning"
                onclick="option('bajaTemporal','');">
                <i class="fas fa-user-minus me-2"></i> Ver bajas del periodo
            </button>
        </div>
    </div>

    <table class="table table-hover table-responsive table-striped" id="tablaBajas">
        <thead>
            <tr class="table-dark text-center">
                <th class="text-center">Id baja</th>
                <th class="text-center">Numero de control</th>
                <th class="text-center">Nombre alumno</th>
                <th class="text-center">Tipo de baja</th>
                <th class="text-center">Motivo</th>
                <th class="text-center">Fecha</th>
                <th class="text-center">Periodo</th>
                <th class="text-center">Estatus</th>
                <th class="text-center">Opciones</th>
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
                        case 'Aplicada':
                            $badgeClass = "bg-success";
                            break;
                        case 'No aplicada':
                            $badgeClass = "bg-danger";
                            break;
                    }
                        ?>
                        <tr class="">
                        <td><?= $fila['clave_baja'] ?></td>
                        <td><?= $fila['numero_de_control'] ?></td>
                        <td><?= $fila['nombre_de_alumno'] ?></td>
                        <td><?= $fila['tipo_de_baja'] ?></td>
                        <td><?= $fila['motivo'] ?></td>
                        <td><?= $fila['fecha_de_baja'] ?></td>
                        <td><?= $fila['periodo'] ?></td>
                        <td><span class="badge <?= $badgeClass ?>"><?= $fila['estado'] ?></span></td>
                <td>
                    <div class="d-flex gap-2 justify-content-center">
                        <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="loadFormBajaAlumnos('modBaja','<?= $fila['clave_baja'] ?>');">
                            <i class="fas fa-edit me-1"></i>
                            <span>Editar</span>
                        </button>
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