<?php
?>
<h2 class="mb-4">JEFE DE CARRERA</h2>

<div class="row mb-3">
    <div class="col-12 text-end ">
        <button type="button" class="btn" style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                onclick="location.href='index.php';">
            <i class="fas fa-arrow-circle-left"></i> Regresar
        </button>
        <button type="button" class="btn" style="background-color: #009475; border-color: #009475; color: white;"
                onclick="">
            <i class="fas fa-plus-circle"></i> Nuevo jefe de carrera
        </button>
    </div>
</div>

<div class="row">
    <div class="col-12">
        <div id="frmArea"></div>
    </div>
</div>

<table class="table table-hover" id="tableCareerManager">
    <thead>
    <tr class="table-dark text-center">
        <th>ID Jefe carrera</th>
        <th>Nombre</th>
        <th>Estado</th>
        <th>Opciones</th>
    </tr>
    </thead>
    <tbody>
    <tr class="text-center align-middle">
        <td>1</td>
        <td><i class="fas fa-user-tie me-2"></i>Luis Fernando</td>
        <td><span class="badge bg-success">Activo</span></td>
        <td>
            <div class="d-flex gap-2 justify-content-center">
                <button class="btn btn-primary btn-sm d-flex align-items-center"
                        onclick="">
                    <i class="fas fa-edit me-1"></i>
                    <span>Editar</span>
                </button>
                <label>
                    <select class="form-select form-select-sm btn-warning"
                            style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                            onchange="changeStatusJefeCarrera('1', this.value, '2')">
                        <option disabled selected>Cambiar estado</option>
                        <option value="1">Activo</option>
                        <option value="2">Inactivo</option>
                    </select>
                </label>
            </div>
        </td>
    </tr>
    </tbody>
</table>