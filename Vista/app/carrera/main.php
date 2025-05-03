<div id="frmArea">
    <h2 class="mb-4">CARRERA</h2>

    <div class="row mb-3">
        <div class="col-12 text-end ">
            <button type="button" class="btn" style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                    onclick="location.href='index.php';">
                <i class="fas fa-arrow-circle-left"></i> Regresar
            </button>
            <button type="button" class="btn" style="background-color: #009475; border-color: #009475; color: white;"
                    onclick=" loadFormJCarrera('fmrcarrera',''); cargaRetrasadaDeDatos('add'); ">
                <i class="fas fa-plus-circle"></i> Nueva carrera
            </button>
        </div>
    </div>

    <table class="table table-hover" id="tableCarrera">
        <thead>
        <tr class="table-dark text-center">
            <th>ID carrera</th>
            <th>Nombre de la carrera</th>
            <th>ID jefe de carrera</th>
            <th>Nombre del jefe de carrera</th>
            <th>Estado</th>
            <th>Opciones</th>
        </tr>
        </thead>
        <tbody>
        <tr class="">
            <td>IINF-2010-220</td>
            <td>Informtacia</td>
            <td>ENC-1234</td>
            <td>Luis Fernando</td>
            <td>Activo</td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="loadFormJCarrera('modcarrera',''); cargaRetrasadaDeDatos('mod');">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                    <label>
                        <select class="form-select form-select-sm btn-warning"
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="changeStatusCarrera('1', this.value, 'Activo')">
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