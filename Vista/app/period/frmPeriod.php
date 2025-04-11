<?php

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/PeriodoDAO.php';

$objBD = new ConexionBD($DatosBD);
$objPeDAO = new PeriodoDAO($objBD->Conectar());

$siguienteID = $objPeDAO->obtenerSiguienteIDPeriodo();

?>

<div class="card shadow-sm border-0 mb-4">

    <div class="card-header bg-primary text-white">
        <h5 class="card-title mb-0">
            <i class="fas fa-calendar-alt me-2"></i>Insertar Nuevo Periodo Académico
        </h5>
    </div>

    <div class="card-body">
        <form id="frmPeriodo" class="needs-validation" novalidate>
            <input type="hidden" id="modifica" value="">

            <!-- Primera fila: ID y Nombre -->
            <div class="row mb-4">
                <!-- ID Periodo -->
                <div class="col-md-3">
                    <div class="form-floating mb-3 mb-md-0">
                        <input type="text" class="form-control" id="txtId" placeholder="202401" required disabled
                               value="<?= $siguienteID ?>">
                        <label for="txtId">
                            ID del Periodo
                        </label>
                        <div class="invalid-feedback">
                            Por favor ingrese un ID válido
                        </div>
                    </div>
                </div>

                <!-- Nombre del Periodo -->
                <div class="col-md-5">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="txtPeriodo" placeholder="Agosto 2024 - Enero 2025"
                               maxlength="30" required oninput="validarCaracteres(this)">
                        <label for="txtPeriodo">Nombre del Periodo</label>
                        <div class="invalid-feedback" id="periodoFeedback">
                            No se permiten caracteres especiales en el nombre del periodo. Utilice solo letras, números,
                            espacios y guiones.
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
                        <label for="txtEstatus">Estatus</label>
                        <div class="invalid-feedback">
                            Por favor seleccione un estatus
                        </div>
                    </div>
                </div>
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
            <div class="row">
                <div class="col-12 d-flex gap-2">
                    <button type="button" class="btn btn-primary"
                            onclick="validafrmPeriodo('Datos guardados correctamente','Agregar');">
                        <i class="fas fa-save me-2"></i>Guardar
                    </button>
                    <button type="button" class="btn btn-outline-secondary" onclick="option('period' , '')">
                        <i class="fas fa-times-circle me-2"></i>Cancelar
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
