<link rel="stylesheet" href="../css/styleInterno.css">

<div class="container" id="bajaManual">
    <div class="row justify-content-center">
        <div class="ampliacion">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-user-minus me-2"></i>
                        Registro de baja manual
                    </h5>
                </div>
                <div class="card-body p-4">
                    <form>
                        <div class="row align-items-end">
                            <div class="col-md-6 mb-3">
                                <label for="nombre" class="form-label">Numero control del alumno</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light">
                                        <i class="fas fa-user-minus me-2"></i>
                                    </span>
                                    <input type="text"
                                        maxlength="10"
                                        title='10 caracteres máximo, puede iniciar con "C"'
                                        class="form-control"
                                        id="id_alumno"
                                        oninput="validarNumeroControlBaja('id_alumno', 'buscarAlumnoBtn', 'mb-3')"
                                        placeholder="Ej: 12345678" required>
                                </div>
                            </div>



                            <!-- Botón buscar alumno -->
                            <div class="col-md-6 mb-3 d-flex justify-content-center gap-3">
                                <button type="button" class="btn btn-primary px-4" id="buscarAlumnoBtn" disabled>
                                    <i class="fas fa-search me-2"></i>
                                    Buscar Alumno
                                </button>

                                <button type="button" class="btn" style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                                onclick="option('baja','');">
                                <i class="fas fa-arrow-circle-left"></i> Regresar
                            </button>
                            </div>
                            
                        </div>
                        <!-- Loader muestra una pequeña animacion de carga -->
                        <div id="loader" class="d-none"> Buscando alumno...</div>

                        <script>
                            document
                                .getElementById("buscarAlumnoBtn")
                                .addEventListener("click", function() {
                                    iniciarFuncionesBajaAlumnos('buscarAlumno', '');
                                });
                        </script>

                        <!-- Información Del alumno -->
                        <div class="row mb-4">
                            <div class="col-12">
                                <div id="alumnoInfoclass" class="alert alert-info " role="alert">
                                    <i class="fas fa-info-circle me-2"></i>
                                    <strong>Información Del alumno:</strong>
                                    <span id="alumnoInfo">Ingrese el numero de control del Alumno.</span>
                                </div>
                            </div>
                        </div>

                        <!-- Campos ocultos que aparecerán tras la búsqueda -->
                        <div id="datosAlumno" class="d-none">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Nombre del Alumno</label>
                                    <input type="text" class="form-control" id="nombreAlumno" readonly>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Carrera</label>
                                    <input type="text" class="form-control" id="carreraAlumno" readonly>
                                </div>


                                <!-- Selección del periodo para la baja -->
                                <div class="row">
                                    <!-- Selección del periodo -->
                                    <div class="col-md-6 mb-3">
                                        <label for="periodo_Id" class="form-label">Nombre del periodo</label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-blue-light"><i class="fas fa-calendar me-2"></i></span>
                                            <select name="periodo_nombre" id="periodo_nombre" class="form-select" style="padding: 0.8rem;"
                                                required>
                                                <option value="" disabled selected>Seleccione un periodo</option>
                                                <option value="1">Periodo 1</option>
                                                <option value="2">Periodo 2</option>
                                                <option value="3">Periodo 3</option>
                                                <option value="4">Periodo 4</option>
                                            </select>
                                        </div>
                                    </div>

                                    <!-- ID del periodo (campo deshabilitado) -->
                                    <div class="col-md-6 mb-3">
                                        <label for="idperiodo" class="form-label">ID Periodo</label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-blue-light"><i class="fas fa-calendar me-2"></i></span>
                                            <input type="text" id="idperiodo" class="form-control" disabled>
                                        </div>
                                    </div>
                                </div>


                                <script>
                                    // Evento que escucha cambios en el select
                                    document.getElementById("periodo_nombre").addEventListener("change", function() {
                                        document.getElementById("idperiodo").value = this.value;
                                        validarCamposRestantesBaja('idperiodo', 'btnGuardarJ', 'row');
                                    });
                                </script>
                                <!-- Motivo y tipo de baja -->
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Motivo de la baja <span class="text-danger">*</span></label>
                                    <textarea class="form-control" id="motivoBaja" rows="3" required oninput="validarCamposRestantesBaja('motivoBaja', 'btnGuardarJ', 'mb-3')"></textarea>
                                </div>


                                <div class="row">
                                    <div class="col-md-4 offset-md-4 col-12 mb-3">
                                        <label class="form-label d-block text-center">Tipo de baja</label>
                                        <select class="form-select text-center"
                                            id="tipoBaja"
                                            onchange="validarCamposRestantesBaja('tipoBaja', 'btnGuardarJ', 'mb-3')"
                                            required>
                                            <option selected disabled value="">Seleccione...</option>
                                            <option value="Definitiva">Definitiva</option>
                                            <option value="Temporal">Temporal</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Botones de acción -->
                            <div class="row">
                                <div class="col-12 separarBotones gap-2">
                                    <button type="button"
                                        id="btnGuardarJ"
                                        class="btn btn3 btn-primary"
                                        disabled
                                        onclick="validarFormularioBaja()">
                                        <i class="fas fa-save me-2"></i>Guardar
                                    </button>
                                    <button type="button"
                                        class="btn btn-outline-secondary"
                                        onclick="clearArea('bajaManual'); option('baja','')">
                                        <i class="fas fa-times-circle me-2"></i>Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>


                    <!-- Botón para mostrar/ocultar historial -->
                    <button id="btnToggleHistorial" class="btn btn-outline-primary btn-sm mt-2">
                        Ver historial de bajas
                    </button>


                    <!--Script para mostrar o ocultar el historial del bajas-->
                    <script>
                        document.getElementById("btnToggleHistorial").addEventListener("click", () => {
                            const contenedor = document.getElementById("contenedorHistorial");
                            const boton = document.getElementById("btnToggleHistorial");

                            contenedor.classList.toggle("d-none");

                            if (contenedor.classList.contains("d-none")) {
                                boton.textContent = "Ver historial de bajas";
                            } else {
                                boton.textContent = "Ocultar historial de bajas";
                            }
                        });
                    </script>

                    <!-- Historial de bajas -->
                    <div id="contenedorHistorial" class="mt-3 d-none">
                        <h6>Historial de bajas</h6>
                        <table class="table table-bordered table-sm">
                            <thead class="table-light">
                                <tr>
                                    <th>ID Periodo</th>
                                    <th>Nombre Periodo</th>
                                </tr>
                            </thead>
                            <tbody id="tablaHistorial">
                                <!-- Se llena dinámicamente -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>