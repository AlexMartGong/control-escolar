<?php
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/ParcialDAO.php';

$objBD = new ConexionBD($DatosBD);
$objPaDAO = new ParcialDAO($objBD->Conectar());

$res = $objPaDAO->MostrarParcial();
?>

<div id="frmArea">
    <h2 class="mb-4">Parcial</h2>

    <div class="row mb-3">
        <div class="col-12 text-end">
            <button type="button" class="btn" style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                onclick="location.href='index.php';">
                <i class="fas fa-arrow-circle-left"></i> Regresar
            </button>
            <button type="button" class="btn" style="background-color: #009475; border-color: #009475; color: white;"
                onclick="loadFormParcial('frmParcial','');">
                <i class="fas fa-plus-circle"></i> Agregar Parcial
            </button>
        </div>
    </div>

    <table class="table table-hover table-responsive table-striped" id="tableParcial">
        <thead>
            <tr class="table-dark text-center">
                <th>Id parcial</th>
                <th>Nombre parcial</th>
                <th>Id periodo</th>
                <th>Nombre periodo</th>
                <th>Fecha de inicio</th>
                <th>Fecha de termino</th>
                <th>estatus</th>
                <th>Opciones</th>
            </tr>
        </thead>
        <tbody class="">
            <?php
            if ($res['estado'] == 'OK' && $res['filas'] > 0) {
                $cont = 1;
                foreach ($res['datos'] as $fila) {

                    $rowClass = "table-success";

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
                        <td><?= $fila['clave_parcial'] ?></td>
                        <td><?= $fila['nombre_parcial'] ?></td>
                        <td><?= $fila['clave_periodo'] ?></td>
                        <td><?= $fila['periodo'] ?></td>
                        <td><?= $fila['fecha_inicio_de_parcial'] ?></td>
                        <td><?= $fila['fecha_termino_de_parcial'] ?></td>
                        <td><span class="badge <?= $badgeClass ?>"><?= $fila['estado'] ?></span></td>
                        <td>
                            <div class="d-flex gap-2 justify-content-center">
                                
                                <?php if ($fila['estado'] === 'Abierto' || $fila['estado'] === 'Pendiente') : 
                                ?>
                                <button class="btn btn-primary btn-sm d-flex align-items-center"
                                    onclick="loadFormParcial('modParcial', <?= $fila['clave_parcial'] ?>)">
                                    <i class="fas fa-edit me-1"></i>
                                    <span>Editar</span>
                                </button>
                                <?php else : 
                                ?>
                                <button class="btn btn-primary btn-sm d-flex align-items-center" title="No editable"
                                    disabled>
                                    <i class="fas fa-edit me-1"></i>
                                    <span>Editar</span>
                                </button>
                                <?php endif; 
                                ?>

                                <label>
                                    <select class="form-select form-select-sm btn-warning"
                                        style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                        onchange="changeStatusParcial('<?= $fila['clave_parcial'] ?>', this.value, '<?= $fila['estado'] ?>');">
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
            }
            ?>
        </tbody>
    </table>
</div>

<!-- este codigo se comento para que no se pueda editar el parcial si esta cerrado o cancelado


    <?php //if ($fila['estado'] === 'Abierto' || $fila['estado'] === 'Pendiente') : 
    ?>
        <button class="btn btn-primary btn-sm d-flex align-items-center"
            onclick="option('modParcial', <? //= $fila['clave_periodo'] 
                                            ?>)">
            <i class="fas fa-edit me-1"></i>
            <span>Editar</span>
        </button>
    <?php //else : 
    ?>
        <button class="btn btn-primary btn-sm d-flex align-items-center" title="No editable"
            disabled>
            <i class="fas fa-edit me-1"></i>
            <span>Editar</span>
        </button>
    <?php //endif; 
    ?>
-->