
<link rel="stylesheet" href="../css/styleInterno.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
<!--estilos para las etiquetas </select>-->
<style>
    .select2-container .select2-selection--single {
        height: 47px;
        padding: 0.50rem 1rem;
        line-height: 15px;

    }

    .select2-selection__arrow {
        height: 48px !important;
    }

    .select2-container--default .select2-results__option--highlighted.select2-results__option--selectable {
        background-color: rgb(107, 105, 105) !important;
        color: white;
    }

    .select2-container {
        border-radius: 7px;
    }
</style>


<div class="container" id="fmrcarrera">
    <div class="row justify-content-center">
        <div class="card shadow-sm border-0 mb-4">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-clipboard-list me-2"></i>
                        Modificar datos de oferta
                    </h5>


                </div>
                <div class="card-body p-3 p-md-4">
                    <form>
                        <!-- Campo: Id oferta-->
                        <div class="row">
                            <div class="col-md-5-5 mb-3">
                                <label for="idOferta" class="form-label">Id oferta</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                    <input

                                        type="text"
                                        class="form-control"
                                        id="idOferta"
                                        oninput=""
                                        disabled>
                                </div>
                            </div>

                            <!-- Campo: Estado -->
                            <div class="col-md-5-5 mb-3">
                                <label class="form-label" for="estado">Estado</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light"><i class="fas fa-check-circle"></i></span>
                                    <select class="form-control" disabled id="estado">
                                        <option value="No asignada" selected>No asignada</option>
                                        <option value="Asignada">Asignada</option>
                                    </select>
                                </div>
                            </div>
                        </div>


                        <!-- Carrera y periodo -->
                        <div class="row g-4 m-auto">
                            <!-- Columna izquierda -->
                            <!-- Campo: Carrera -->
                            <div class=" col-md-5-5 bg-light border rounded p-3 margin-derecha margin-izquierda ">
                                <div class="mb-3 rounded-end">
                                    <label for="listaCarrera" class="form-label">Nombre Carrera</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="bi bi-mortarboard"></i></span>
                                        <select id="listaCarrera" class="form-select listaDespliege" onchange="retrasoSelect('claveCarrera', 'btnGuardarJ', 'oferta','mb-3' )">
                                            <option disabled selected>Seleccione una carrera</option> 
                                        </select>
    
                                        <script>
                                            // Inicializar Select2 Materia
                                            $(document).ready(function() {
                                                $('#listaCarrera').select2({

                                                    width: '83%'
                                                });
                                                // evento que escucha el cambio y manda la clave al campo clave
                                                $('#listaCarrera').on('change', function() {
                                                    const clave = $(this).val();
                                                    $('#claveCarrera').val(clave);
                                                });
                                            });
                                        </script>

                                    </div>
                                </div> <!--termina campo-->
                                <!--campo Clave-->
                                <div class="mb-3">
                                    <label for="claveCarrera" class="form-label">Clave</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                        <input
                                            type="text"
                                            id="claveCarrera"
                                            name="claveCarrera"
                                            class="form-control"
                                            style="flex: .95 1 auto !important;"
                                            disabled>
                                    </div>
                                </div>
                            </div>
                            <!--termina lado izquierdo-->


                            <!--inicia lado derecho-->
                            <div class=" col-md-5-5 bg-light border rounded p-3  margin-izquierda ">
                                <div class="mb-3">
                                    <label for="listaDocente" class="form-label">Periodo</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="fas fa-calendar"></i></span>
                                        <select id="listaPeriodo" class="form-select listaDespliege " "> //onchange="retrasoSelect('IdPeriod', 'btnGuardarJ', 'oferta','mb-3' )
                                            <option disabled selected>Seleccione un Periodo</option>
                                            
                                        </select>
                                        <script>
                                            // Inicializar Select2 Materia
                                            $(document).ready(function() {
                                                $('#listaPeriodo').select2({
                                                    width: '82%'
                                                });
                                                // evento que escucha el cambio y manda el dato al campo estado
                                                $('#listaPeriodo').on('change', function() {
                                                    const estatus = $(this).val();
                                                    $('#IdPeriod').val(estatus);
                                                });
                                            });
                                        </script>
                                    </div>
                                </div>

                                <!--termina periodo-->
                                <!--incia campo clave-->
                                <div class="mb-3">
                                    <label for="IdPeriod" class="form-label">Id periodo</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                        <input
                                            type="text"
                                            id="IdPeriod"
                                            class="form-control"
                                            style="flex: .95 1 auto !important;"
                                            disabled>
                                    </div>
                                </div>
                            </div>
                            <!--termina lado derecho-->
                        </div><!--termina primera seccion-->

                        <!-- Semestre,grupo y turno -->
                        <div class="mb-1 mt-2 ">
                            <div class="row g-2">
                                <!-- Campo: Semestre -->
                                <div class="col-md-4 mb-3">
                                    <label for="idSemestre" class="form-label">Semestre</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="bi bi-bar-chart-line"></i></span>
                                        <input type="number"
                                            class="form-control"
                                            oninput="verificarEntradasOferta('idSemestre', 'btnGuardarJ', 'col-md-4')"
                                            id="idSemestre"
                                            placeholder="Ingrese el semestre" required>
                                    </div>
                                </div>
                                <!-- Campo: Grupo -->
                                <div class="col-md-4 mb-3">
                                    <label for="idGrupo" class="form-label">Grupo</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="bi bi-people"></i></span>
                                        <input type="text"
                                            style="text-transform: uppercase;"
                                            id="idGrupo"
                                            oninput="verificarEntradasOferta('idGrupo', 'btnGuardarJ', 'col-md-4')"
                                            maxlength="1"
                                            class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label for="turno" class="form-label">Turno</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="bi bi-clock"></i></span>
                                        <select class="form-select listaDespliege" id="turno" "> //onchange="retrasoSelect('turno', 'btnGuardarJ', 'oferta','col-md-4' )
                                            <option disabled selected>Seleccione un turno</option>
                                            <option value="Matutino">Matutino</option>
                                            <option value="Vespertino">Vespertino</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div> <!-- Termina Semestre,grupo y turno -->

                        <!--Inicia seccion materia y docente-->

                        <div class="row g-3 m-auto">
                            <!-- Campo: materia -->
                            <!--inicia lado izquierdo-->
                            <div class="col-md-5-5 bg-light border rounded p-3 margin-derecha margin-izquierda">
                                <div class="mb-3">
                                    <label for="listaMateria" class="form-label">Nombre Materia</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="fas fa-book"></i></span>
                                        <select id="listaMateria" class="form-select listaDespliege" onchange="actualizaClaveMateria();">
                                            
                                        </select>
                                        <script>
                                            // Inicializar Select2 Materia
                                            $(document).ready(function() {
                                                $('#listaMateria').select2({
                                                    width: '82%'
                                                });
                                                // evento que escucha el cambio y manda la clave al campo clave
                                                $('#listaMateria').on('change', function() {
                                                    const clave = $(this).val();
                                                    $('#claveMateria').val(clave);
                                                });
                                            });
                                        </script>
                                    </div>
                                </div>

                                <!--Inicia campo clave-->

                                <div class="mb-3">
                                    <label for="claveMateria" class="form-label">Clave</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light">
                                            <i class="fas fa-id-card"></i>
                                        </span>
                                        <input
                                            type="text"
                                            id="claveMateria"
                                            class="form-control"
                                            style="flex: .95 1 auto !important;"
                                            disabled>
                                    </div>
                                </div>
                            </div>
                            <!--Terminan campo Izquierdo-->

                            <!--Inicia campo derecho Campo docente-->
                            <div class=" col-md-5-5 bg-light border rounded p-3 margin-izquierda">
                                <div class="mb-3  ">
                                    <label for="listaDocente" class="form-label">Nombre Docente</label>
                                    <div class="input-group">

                                        <span class="input-group-text bg-blue-light"><i class="fas fa-chalkboard-teacher"></i></span>
                                        <select id="listaDocente" class="form-select listaDespliege " "> //onchange="retrasoSelect('claveDocente', 'btnGuardarJ', 'oferta','mb-3' )
                                            <option disabled selected>Seleccione un docente</option>

                                        </select>
                                        <script>
                                            // Inicializar Select2 Materia
                                            $(document).ready(function() {
                                                $('#listaDocente').select2({
                                                    width: '82%'
                                                });
                                                // evento que escucha el cambio y manda la clave al campo clave
                                                $('#listaDocente').on('change', function() {
                                                    const clave = $(this).val();
                                                    $('#claveDocente').val(clave);
                                                });
                                            });
                                        </script>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="claveDocente" class="form-label">Clave</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                        <input
                                            type="text"
                                            id="claveDocente"
                                            class="form-control"
                                            style="flex: .95 1 auto !important;"
                                            disabled>
                                    </div>
                                </div>
                            </div>

                            <!--termina campo derecho-->
                        </div>

                        <div class="row">
                            <div class="col-12 separarBotones gap-2">
                                <button type="button"
                                    id="btnGuardarJ"
                                    class="btn btn3 btn-primary"
                                    onclick=" validarfrmOferta('modificar');"
                                    style="margin-top: 10px"
                                    disabled>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>Modificar
                                </button>
                                <button type="button"
                                    class="btn btn-outline-secondary"
                                    onclick="clearArea('fmrcarrera'); option('oferta','')" style="margin-top: 10px">
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