
<div class="card shadow-sm border-0 mb-4">
    <div class="card-header bg-primary text-white">
        <h5 class="card-title mb-0">
            <i class="fas fa-calendar-alt me-2"></i>Modificación de Periodo Academico
        </h5>
    </div>

    <div class="card-body p-4">
        <form id="frmPeriodo" class="needs-validation" novalidate>

            <!-- Primera fila: ID, Nombre y Buscar -->
            <div class="row mb-4 g-3 align-items-center">
                
            <!-- ID Periodo -->
                <div class="col-md-3">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="txtId" readonly value="<?= $_GET['id'] ?? '' ?>" 
                                placeholder="202401"
                               pattern="[0-9]{6}" aria-describedby="idHelp" required>
                        <label for="txtId">ID Periodo</label>
                        <div class="invalid-feedback">
                            Por favor ingrese un ID válido
                        </div>
                    </div>
                </div>

                <!-- Nombre del Periodo -->
                <div class="col-md-5">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="txtPeriodo" placeholder="ENE-JUN 2024" required>
                        <label for="txtPeriodo">Nombre del Periodo</label>
                        <div class="invalid-feedback">
                            Por favor ingrese un nombre para el periodo
                        </div>
                    </div>
                </div>
                     <!-- Estatus del Periodo -->
         
                <div class="col-md-4">
                    <div class="form-floating">
                        <select class="form-select" id="txtEstatus" required disabled>
                            <option value="Pendiente" selected>Pendiente</option>
                            <option value="Abierto">Abierto</option>
                            <option value="Cerrado">Cerrado</option>
                        </select>
                        <label for="txtEstatus">Estatus del Periodo</label>
                    </div>
                </div>
            
                <!-- Buscar periodo boton desabilitado por el momento
                <div class="col-md-4">
                    <button type="button"
                            class="btn btn-primary d-flex align-items-center justify-content-center btnpequeno"
                            onclick="validarBusqueda();" aria-label="Buscar periodo académico">
                        <i class="fas fa-search me-2"></i>
                        Buscar Periodo
                    </button>
                </div>
                -->

            </div>

            <div class="row g-4">
                <!-- Columna izquierda -->
                <div class=" col-md-6 bg-light">
                   
                <!-- Sección de Fechas del Periodo -->
                    <div class="card h-100 border-0 bg-light">
                        <div class="card-header py-3 bg-light border-bottom border-2">
                            <h6 class="mb-0 text-primary">
                                <i class="fas fa-calendar me-2"></i>Fechas del Periodo
                            </h6>
                        </div>
                        <div class="card-body p-3">
                            <!-- Fecha de Inicio -->
                            <div class="form-floating mb-3">
                                <input type="date" class="form-control" id="txtFechaInicio" required>
                                <label for="txtFechaInicio">Fecha de Inicio</label>
                                <div class="invalid-feedback">
                                    Por favor seleccione la fecha de inicio
                                </div>
                            </div>

                            <!-- Fecha de Término -->
                            <div class="form-floating">
                                <input type="date" class="form-control" id="txtFechaTermino" required>
                                <label for="txtFechaTermino">Fecha de Término</label>
                                <div class="invalid-feedback">
                                    Por favor seleccione la fecha de término
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
           
                <!-- Columna derecha -->
                <div class=" col-md-6 bg-light">
                    <!-- Sección de Fechas de Ajustes -->
                    <div class="card h-100 border-0 bg-light">
                        <div class="card-header py-3 bg-light border-bottom border-2">
                            <h6 class="mb-0 text-primary">
                                <i class="fas fa-tools me-2"></i>Periodo de Ajustes
                            </h6>
                        </div>
                        <div class="card-body p-3">
                            <!-- Inicio de Ajustes -->
                            <div class="form-floating mb-3">
                                <input type="date" class="form-control" id="txtFechaInicioAjuste" required>
                                <label for="txtFechaInicioAjuste">Inicio de Ajustes</label>
                                <div class="invalid-feedback">
                                    Por favor seleccione la fecha de inicio de ajustes
                                </div>
                            </div>

                            <!-- Fin de Ajustes -->
                            <div class="form-floating">
                                <input type="date" class="form-control" id="txtFechaFinalAjuste" required>
                                <label for="txtFechaFinalAjuste">Fin de Ajustes</label>
                                <div class="invalid-feedback">
                                    Por favor seleccione la fecha final de ajustes
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

       

            <!-- Botones de acción -->
            <div class="d-flex gap-3 mt-4">
                <button type="button" class="btn btn-primary px-4 py-2 d-flex align-items-center" id="btnActualizar"
                        onclick="validafrmPeriodo('El período académico ha sido actualizado exitosamente','Modificar');">
                    <i class="fas fa-save me-2"></i>Actualizar
                </button>
                <button type="button" class="btn btn-outline-secondary px-4 py-2 d-flex align-items-center"
                        onclick="option('period')">
                    <i class="fas fa-times-circle me-2"></i>Cancelar
                </button>
            </div>
        </form>
    </div>
</div>
<script>
    $(document).ready(function () {
        buscarPeriodo();
    });
</script>
