<link rel="stylesheet" href="../css/styleInterno.css">

<div class="container" id="fmrcarrera">
    <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8 ampliacion">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title mb-0">
                    <i class="fas fa-book me-2"></i>
                        Modificar datos de Materia
                    </h5>
                </div>
                <div class="card-body p-3 p-md-4">
                    <form>
                        <div class="mb-3 mb-md-4">
                            <label for="clavemateria" class="form-label">Clave de materia</label>
                            <div class="input-group">
                                <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                <input
                                    type="text"
                                    maxlength="15"
                                    title="Solo letras, números y guion medio. Máximo 15 caracteres."
                                    class="form-control"
                                    id="clavemateria"
                                    oninput=""
                                     disabled>
                            </div>
                        </div>

                        <div class="mb-3 mb-md-4">
                            <label for="nombremateria" class="form-label">Nombre de Materia</label>
                            <div class="input-group">
                                <span class="input-group-text bg-blue-light"><i class="bi bi-mortarboard"></i></span>
                                <input type="text"
                                    maxlength="100"
                                    title='Maximo 100 caracteres'
                                    class="form-control"
                                    oninput="verificarInputmateria('nombremateria', 'btnGuardarJ' , 'mb-3')"
                                    id="nombremateria"
                                    placeholder="Ingrese el nombre de materia" required>
                            </div>
                        </div>

                        <div class="mb-3 mb-md-4">
                            <div class="row g-2">
                                <div class="col-12 col-sm-4 mb-2 mb-sm-0">
                                    <label for="horasPracticas" class="form-label">Horas Praticas</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="bi bi-tools"></i></span>
                                        <input type="number"
                                        title="Solo se permiten numeros"
                                            id="horasPracticas"
                                            oninput="verificarInputmateria('horasPracticas', 'btnGuardarJ' , 'col-12')"
                                            class="form-control">
                                    </div>
                                </div>
                                <div class="col-12 col-sm-4 mb-2 mb-sm-0">
                                    <label for="horasTeoricas" class="form-label">Horas Teoricas</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="bi bi-journal-text"></i></span>
                                        <input type="number"
                                            title="Solo se permiten numeros"
                                            oninput="verificarInputmateria('horasTeoricas', 'btnGuardarJ' , 'col-12')"
                                            id="horasTeoricas"
                                            class="form-control">
                                    </div>
                                </div>
                                <div class="col-12 col-sm-4">
                                    <label for="numUnidades" class="form-label">Numero de unidades</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="bi bi-collection"></i></span>
                                        <input type="number"
                                            title="Solo se permiten numeros"
                                            oninput="verificarInputmateria('numUnidades', 'btnGuardarJ' , 'col-12')"
                                            id="numUnidades"
                                            class="form-control">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3 mb-md-4">
                            <div class="row g-2">
                                <div class="col-12 col-sm-6 mb-2 mb-sm-0">
                                    <label for="statusId" class="form-label">Estado</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="fas fa-check-circle"></i></span>
                                        <select class="form-control listaDespliege " disabled id="statusId">
                                            <option value="Activo" selected>Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-6">
                                    <label for="creditos" class="form-label">Creditos</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="bi bi-mortarboard"></i></span>
                                        <input type="number"
                                            title="Solo se permiten numeros"
                                             oninput="verificarInputmateria('creditos', 'btnGuardarJ' , 'col-12')"
                                            id="creditos"
                                            class="form-control">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3 mb-md-4">
                            <label class="form-label">Carrera</label>
                            <div class="row g-2">
                                <div class="col-12 col-sm-6 mb-2 mb-sm-0">
                                    <label for="listaNombresMaterias" class="form-label">Nombre</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="bi bi-mortarboard"></i></span>
                                        <select id="listaNombresMaterias" class="form-select listaDespliege " onchange="retrasoSelect('claveCarrera', 'btnGuardarJ', 'materia','col-12' )">
                                           <option disabled selected>Seleccione una carrera</option>
                                        <!--Aqui se inyectaran las opciones -->
                                        </select>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-6">
                                    <label for="claveCarrera" class="form-label">Clave</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                        <input
                                            type="text"
                                            id="claveCarrera"
                                            class="form-control"
                                            disabled>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12 separarBotones gap-2">
                            <button type="button"
                                    id="btnGuardarJ"
                                    class="btn btn3 btn-primary"
                                    onclick="validarCamposmateria('modificar');"
                                    disabled
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>Modificar
                                </button>
                                <button type="button"
                                class="btn btn-outline-secondary"
                                    onclick="clearArea('fmrcarrera'); option('materia','')">
                                    <i class="fas fa-times-circle me-2"></i>Cancelar
                                </button>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>




