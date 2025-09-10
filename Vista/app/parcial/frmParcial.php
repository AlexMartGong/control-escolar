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
                        <div class="row">
                            <!-- Selección del periodo -->
                            <div class="col-md-6 mb-3">
                                <label for="periodo_Id" class="form-label">Nombre del periodo</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light"><i class="fas fa-calendar me-2"></i></span>
                                    <select name="periodo_Id" id="periodo_Id" class="form-select" style="padding: 0.8rem;"
                                        oninput="validarEntrdasParcial('periodo_Id', 'btnGuardarJ', 'periodoInfo', 'row')" required>
                                        <option value="" disabled selected>Seleccione un periodo</option>
                                        <option value="1" data-estado="pendiente">Periodo 1</option>
                                        <option value="2" data-estado="abierto">Periodo 2</option>
                                        <option value="3" data-estado="abierto">Periodo 3</option>

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
                            document.getElementById("periodo_Id").addEventListener("change", function() {
                                document.getElementById("idperiodo").value = this.value;
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