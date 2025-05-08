<?php
?>
<div id="frmArea">
    <h2 class="mb-4">Materia</h2>

    <div class="row mb-3">
        <div class="col-12 text-end ">
            <button type="button" class="btn" style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                    onclick="location.href='index.php';">
                <i class="fas fa-arrow-circle-left"></i> Regresar
            </button>
            <button type="button" class="btn" style="background-color: #009475; border-color: #009475; color: white;"
                    onclick="">
                <i class="fas fa-plus-circle"></i> Nueva materia
            </button>
        </div>
    </div>

    <table class="table table-hover" id="tableMateria">
        <thead>
        <tr class="table-dark text-center">
            <th>ID Materia</th>
            <th>Nombre</th>
            <th>No. de unidades</th>
            <th>Hrs. Teoricas</th>
            <th>Hrs. Practicas</th>
            <th>Creditos</th>
            <th>ID carrera</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Opciones</th>
        </tr>
        </thead>
        <tbody>
        <tr class="">
            <td>1</td>
            <td>Programacion Orientado a objetos</td>
            <td>5</td>
            <td>44</td>
            <td>30</td>
            <td>3</td>
            <td>2</td>
            <td>Ing. Informatica</td>
            <td>Activo</td>
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
                                onchange="changeStatusMateria(1, this.value, 'Activo');">
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