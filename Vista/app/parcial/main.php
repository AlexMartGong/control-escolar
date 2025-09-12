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
                            onclick="loadFormParcial('modParcial','1');">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                    <label>
                        <select class="form-select form-select-sm btn-warning"
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="">
                            <option disabled selected>Cambiar estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
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
                                onchange="">
                            <option disabled selected>Cambiar estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </label>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</div>
