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
        <tr>
            <td>21089632</td>
            <td>Jose Angel Gonzales Perez</td>
            <td>Masculino</td>
            <td>6</td>
            <td>A</td>
            <td>Matutino</td>
            <td>1</td>
            <td>Informatica</td>
            <td>INFN-9658-9648</td>
            <td><span class="badge bg-success">Activo</span></td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="loadFormAlumno('modalumno', '21089632')">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                    <label>
                        <select class="form-select form-select-sm btn-warning"
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="">
                            <option disabled selected>Cambiar estado</option>
                            <option value="Avtivo">Activo</option>
                            <option value="Baja Temporal">Baja Tempora</option>
                             <option value="Baja">Baja</option>
                             <option value="Baja Definitiva">Baja Definitiva</option>
                        </select>
                    </label>
                
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</div>

