<link rel="stylesheet" href="../css/styleInterno.css">


<div class="container" id="frmparcial">
    <div class="row justify-content-center">
        <div class="ampliacion">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-tasks me-2"></i>
                        Registro de nuevo Parcial
                    </h5>
                </div>
                <div class="card-body p-4">
                    <form>
                        <div class="mb-4">
                            <label for="nombre" class="form-label">Nombre de parcial</label>
                            <div class="input-group">
                                <span class="input-group-text bg-blue-light"><i class="fas fa-tasks me-2"></i></span>
                                <input type="text"
                                    maxlength="50"
                                    title='Maximo 50 caracteres'
                                    class="form-control"
                                    oninput="validarEntrdasParcial('nombre_parcial', 'btnGuardarJ','', 'mb-4')"
                                    id="nombre_parcial"
                                    placeholder="Ingrese nombre de parcial" required>
                            </div>

                        </div>

                        <!--Fechas-->

                        <div class="row">
                            <!--Fecha de inicio-->
                            <div class="col-md-6 mb-3">
                                <label for="fechaInicio" class="form-label">Fecha Inicio Parcial</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-plus" viewBox="0 0 16 16">
                                            <path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7" />
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                        </svg></span>
                                    <input type="date" class="form-control"
                                        id="fechaInicio"
                                        oninput="validarEntrdasParcial('fechaInicio', 'btnGuardarJ','', 'mb-3')">
                                </div>
                            </div>


                            <!--Fecha de Termino-->
                            <div class="col-md-6 mb-3">
                                <label for="fechaTermino" class="form-label">Fecha Fin Parcial</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-check" viewBox="0 0 16 16">
                                            <path d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
                                            <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5z" />
                                        </svg></span>
                                    <input type="date" class="form-control"
                                        id="fechaFin"
                                        oninput=" validarEntrdasParcial('fechaFin', 'btnGuardarJ','', 'mb-3')">
                                </div>
                            </div>
                            <!--Script para no permitir seleccionar fechas pasdas-->

                            <script>
                                const hoy = new Date().toISOString().split("T")[0];

                                // Asignar como fecha mínima
                                document.getElementById("fechaInicio").setAttribute("min", hoy);
                                document.getElementById("fechaFin").setAttribute("min", hoy);
                            </script>

                        </div>


                        <!--Datos sobre el periodo-->
                        <div class="row">
                            <!-- Selección del periodo -->
                            <div class="col-md-6 mb-3">
                                <label for="periodo_Id" class="form-label">Nombre del periodo</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light"><i class="fas fa-calendar me-2"></i></span>
                                    <select name="periodo_Id" id="periodo_Id" class="form-select" style="padding: 0.8rem;"
                                        oninput="validarEntrdasParcial('periodo_Id', 'btnGuardarJ', 'periodoInfo', 'row')" required>
                                        <option value="" disabled selected>Seleccione un periodo</option>
                                        <option value="1" data-estado="Pendiente">Periodo 1</option>
                                        <option value="2" data-estado="Abierto">Periodo 2</option>
                                        <option value="3" data-estado="Cerrado">Periodo 3</option>
                                        <option value="4" data-estado="Cancelado">Periodo 4</option>
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
                            document.getElementById("periodo_Id").addEventListener("change", function () {
                            const inputId = document.getElementById("idperiodo");
                            inputId.value = this.value; // ← copiar el id

                            // limpiar posible error visual en el input
                            const contenedor = inputId.closest(".mb-3");
                            const errorInvalid = contenedor?.querySelector(".entrada-error");
                            if (errorInvalid) inputId.classList.remove("entrada-error");

                            // si quieres que #periodoInfo muestre el id seleccionado:
                            const info = document.getElementById("periodoInfo");
                            const opt = this.options[this.selectedIndex];
                            info.textContent = this.value; // o, si prefieres, `${this.value} — ${opt?.dataset.estado || ""}`
                        });
                        </script>




                        <!-- Información del periodo actual -->
                        <div class="row mb-4">
                            <div class="col-12">
                                <div id="periodoInfoclass" class="alert alert-info " role="alert">
                                    <i class="fas fa-info-circle me-2"></i>
                                    <strong>Periodo Seleccionado:</strong>
                                    <span id="periodoInfo">Seleccione un periodo.</span>
                                </div>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-check-label" for="estado">Estado</label>
                            <div class="input-group">
                                <span class="input-group-text bg-blue-light"><i class="fas fa-check-circle"></i></span>
                                <select class="form-control" disabled id="perfil_Id">
                                    <option value="pendiente" selected>Pendiente</option>

                                </select>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12 separarBotones gap-2">
                                <button type="button"
                                    id="btnGuardarJ"
                                    class="btn btn3 btn-primary"
                                    onclick="validarFormularioParcial('guardar');"
                                    disabled>
                                    <i class="fas fa-save me-2"></i>Guardar
                                </button>
                                <button type="button"
                                    class="btn btn-outline-secondary"
                                    onclick="clearArea('frmparcial'); option('parcial','')">
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