<div id="frmArea">
    <h2 class="mb-4">Horario</h2>

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
                <th>estatus</th>
                <th>Opciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Parcial 1</td>
                <td>2</td>
                <td>2023-2024</td>
                <td><span class="badge bg-success">Activo</span></td>
                <td>
                    <div class="d-flex gap-2 justify-content-center">
                        <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="loadFormParcial('modParcial','1');" disabled>
                            <i class="fas fa-edit me-1"></i>
                            <span>Editar</span>
                        </button>
                        <label>
                            <select class="form-select form-select-sm btn-warning" 
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="changeStatusParcial('1', this.value);" 
                              >
                                <option disabled>Cambiar estado</option>
                                <option value="pendiente">pendiente</option>
                                <option value="Activo">Abierto</option>
                                <option value="cerrado">Cerrado</option>
                                <option selected value="cancelado">Cancelado</option>
                            </select>
                        </label>
                    </div>
                </td>
            </tr>
            <tr>
                <td>2</td>
                <td>Parcial 2</td>
                <td>1</td>
                <td>2024-2025</td>
                <td><span class="badge bg-danger">Cerrado</span></td>
                <td>
                    <div class="d-flex gap-2 justify-content-center">
                        <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="loadFormParcial('modParcial','1');">
                            <i class="fas fa-edit me-1"></i>
                            <span>Editar</span>
                        </button>
                        <label>
                            <select class="form-select form-select-sm btn-warning"
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="changeStatusParcial('2', this.value);">
                                <option disabled>Cambiar estado</option>
                                <option value="pendiente">pendiente</option>
                                <option selected value="Activo">Abierto</option>
                                <option value="cerrado">Cerrado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </label>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- este codigo se comento para que no se pueda editar el parcial si esta cerrado o cancelado


    <?php //if ($fila['estado'] === 'Abierto' || $fila['estado'] === 'Pendiente') : ?>
        <button class="btn btn-primary btn-sm d-flex align-items-center"
            onclick="option('period-edit', <?//= $fila['clave_periodo'] ?>)">
            <i class="fas fa-edit me-1"></i>
            <span>Editar</span>
        </button>
    <?php //else : ?>
        <button class="btn btn-primary btn-sm d-flex align-items-center" title="No editable"
            disabled>
            <i class="fas fa-edit me-1"></i>
            <span>Editar</span>
        </button>
    <?php //endif; ?>
-->