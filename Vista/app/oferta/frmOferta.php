<link rel="stylesheet" href="../css/styleInterno.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
                    <!--estilos para las etiquetas </select>-->
                     <style>
                        .select2-container .select2-selection--single{
                             height: 47px;
                            padding: 0.50rem 1rem;
                             line-height: 15px;
                                            
                        }
                        .select2-selection__arrow{
                            height: 48px !important;
                        }
                        .select2-container--default .select2-results__option--highlighted.select2-results__option--selectable {
                            background-color:rgb(107, 105, 105) !important; 
                            color: white;
                        }
                        .select2-container{
                            border-radius 7px;
                        }
                    </style>


<div class="container" id="fmrcarrera">
    <div class="row justify-content-center">
        <div class="card shadow-sm border-0 mb-4">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title mb-0">
                    <i class="fas fa-clipboard-list me-2"></i>
                        Nueva Oferta
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
                                            <select  class="form-control" disabled id="perfil_Id" >
                                                <option value="No asignado" selected>No asignada</option>
                                                <option value="Asigando">Asiganda</option>
                                            </select>
                                        </div>
                                    </div>
                            </div>
                            
                          
                              <!-- Carrera y periodo -->
                                 <div class="row g-4 m-auto" >
                                    <!-- Columna izquierda -->  
                                    <!-- Campo: Carrera -->
                                        <div class=" col-md-5-5 bg-light border rounded p-3 margin-derecha margin-izquierda ">
                                        <div class="mb-3 rounded-end">
                                            <label for="listaCarrera" class="form-label">Nombre Carrera</label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-blue-light"><i class="bi bi-mortarboard"></i></span>
                                                <select id="listaCarrera" class="form-select listaDespliege " onchange="retrasoSelect('claveCarrera', 'btnAgregarOferta', 'oferta','mb-3' )">
                                                    <option disabled selected>Seleccione una carrera</option>
                                                    <?php
                                                    //este es solo un ejemplo de como se hara, todo esto se aplicara tambien para Docente,
                                                    //Periodo y Materia
                                                    //todo php es modificable a su gusto
                                                    
                                                /*  while ($d = mysql_fetch_row($ListEsp)) {
                                                        // Suponiendo que $d[0] es la clave y $d[1] es el nombre de la carrera
                                                        echo "<option value='$d[0]' data-clave='$d[0]'>$d[1]</option>";
                                                    }*/
                                                    ?>
                                                   
                                                </select>
                                                    <script>
                                                        // Inicializar Select2 Materia
                                                    $(document).ready(function () {
                                                        $('#listaCarrera').select2({
                                                            
                                                            width:'83%'
                                                        });
                                                        // evento que escucha el cambio y manda la clave al campo clave
                                                        $('#listaCarrera').on('change', function () {
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
                                                    class="form-control" 
                                                    style="flex: .95 1 auto !important;"
                                                    disabled
                                                    >
                                            </div>
                                        </div>
                                     </div>
                                    <!--termina lado izquierdo-->
                                    

                                        <!--inicia lado derecho PERIODO-->
                                           <div class=" col-md-5-5 bg-light border rounded p-3  margin-izquierda ">
                                                <div class="mb-3">
                                                    <label for="listaDocente" class="form-label">Periodo</label>
                                                    <div class="input-group">
                                                        <span class="input-group-text bg-blue-light"><i class="fas fa-calendar"></i></span>
                                                        <select id="listaPeriodo" class="form-select listaDespliege " onchange="retrasoSelect('IdPeriod', 'btnAgregarOferta', 'oferta','mb-3' )">
                                                        <option disabled selected>Seleccione un Periodo</option>
                                                        <!--Aqui se inyectaran las opciones -->
                                                        
                                                        </select>
                                                        <script>
                                                                // Inicializar Select2 Materia
                                                            $(document).ready(function () {
                                                                $('#listaPeriodo').select2({
                                                                    width: '82%'  
                                                                });
                                                                // evento que escucha el cambio y manda el dato al campo estado
                                                                $('#listaPeriodo').on('change', function () {
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
                                            oninput="verificarEntradasOferta('idSemestre', 'btnAgregarOferta', 'col-md-4')"
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
                                                oninput="verificarEntradasOferta('idGrupo', 'btnAgregarOferta', 'col-md-4')"
                                                maxlength="1"
                                                class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                   <label for="turno" class="form-label">Turno</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="bi bi-clock"></i></span>
                                        <select class="form-select listaDespliege" id="turno" onchange="retrasoSelect('turno', 'btnAgregarOferta', 'oferta','col-md-4' )">
                                            <option disabled selected>Seleccione un turno</option>
                                            <option value="matutino">Matutino</option>
                                            <option value="vespertino">Vespertino</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div> <!-- Termina Semestre,grupo y turno -->
                                
                                <!--Inicia seccion materia y docente-->
                                     <div class="row g-3 m-auto" id="camposVacios">
                                            <!-- Campo: materia -->
                                            <!--inicia lado izquierdo-->
                                                <div class="col-md-5-5 bg-light border rounded p-3 margin-derecha margin-izquierda">
                                                     <div class="mb-3">
                                                        <label for="listaMateria" class="form-label">Nombre Materia</label>
                                                        <div class="input-group">
                                                         <span class="input-group-text bg-blue-light"><i class="fas fa-book"></i></span>
                                                        <select id="listaMateria" class="form-select listaDespliege" onchange="retrasoSelect('claveMateria', 'btnAgregarOferta', 'oferta','mb-3' )">
                                                            <option disabled selected>Seleccione una Materia</option>
                                                        <!-- aqui se inyectan las option-->
                                                            
                                                            </select>
                                                             <script>
                                                                        // Inicializar Select2 Materia
                                                                    $(document).ready(function () {
                                                                        $('#listaMateria').select2({
                                                                            width: '82%' 
                                                                        });
                                                                        // evento que escucha el cambio y manda la clave al campo clave
                                                                        $('#listaMateria').on('change', function () {
                                                                            const clave = $(this).val(); 
                                                                            $('#claveMateria').val(clave);
                                                                        });
                                                                    });
                                                            </script>
                                                        </div>
                                                    </div>

                                                <!--Inicia campo clave materia-->

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
                                                    <select id="listaDocente" class="form-select listaDespliege " onchange="retrasoSelect('claveDocente', 'btnAgregarOferta', 'oferta','mb-3' )">
                                                    <option disabled selected>Seleccione un docente</option>
                                                    <!--Aqui se inyectaran las opciones -->
                                                  
                                                    </select>
                                                <script>
                                                            // Inicializar Select2 Materia
                                                        $(document).ready(function () {
                                                            $('#listaDocente').select2({
                                                                width: '82%'  
                                                            });
                                                            // evento que escucha el cambio y manda la clave al campo clave
                                                            $('#listaDocente').on('change', function () {
                                                                const clave = $(this).val(); 
                                                                $('#claveDocente').val(clave);
                                                            });
                                                        });
                                                </script>
                                                </div>
                                            </div>
                                             <!--Inicia campo derecho Campo CLAVE docente-->
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
                                     </div>
                                     <!--TERMINA FORMULARIO>-->

                                      <!--BOTON AGREGAR A TABLA>-->
                        
                        <div class="row">
                            <div class="col-12 separarBotones2 gap-2">
                            <button type="button"
                                    id="btnAgregarOferta"
                                    class="btn btn-success"
                                    onclick=" validarfrmOferta('agregar');" 
                                    disabled>
                                    <i class="fas fa-plus-circle me-1"></i>Agregar a la tabla
                                </button>

                            </div>
                        </div>
                    </form>
                </div>
 
            </div>
        </div>
    </div>
                               <!-- Tabla de Datos de Oferta -->
            <div class="container-fluid mt-4">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Datos de Oferta Académica</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table id="TablaDatosOferta" class="table table-striped table-hover table-bordered">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Id oferta</th>
                                        <th>Semestre</th>
                                        <th>Estado Oferta</th>
                                        <th>Grupo</th>
                                        <th>Turno</th>
                                        <th>Nombre carrera</th>
                                        <th>Clave carrera</th>
                                        <th>Nombre docente</th>
                                        <th>Clave docente</th>
                                        <th>Periodo</th>
                                        <th>Id periodo</th>
                                        <th>Nombre materia</th>
                                        <th>Clave materia</th>
                                         <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Aqui se cargaran los datos del formulario al precionar agregar a la tabla -->
                                    
                                
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-md-6 gap-2 ">
                               <button type="button"
                                    id="btnGuardarJ"
                                    class="btn btn3 btn-primary"
                                    onclick=" intentarGuardarDatosOferta('add')" 
                                    disabled>
                                    <i class="fas fa-save me-2"></i>Guardar Oferta(s)
                                </button>
                                <button type="button"
                                class="btn btn-outline-secondary" 
                                    onclick="clearArea('fmrcarrera'); option('oferta','')">
                                    <i class="fas fa-times-circle me-2"></i>Cancelar
                                </button>
                            </div>
                          
                        </div>
                    </div>
                </div>
            </div>
                <script>  $(document).ready(function() {
                    $('#TablaDatosOferta').DataTable({
                         language: {
                            url: 'https://cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json',
                            paginate: {
                                previous: "Anterior",
                                next: "Siguiente"
                            }
                        },
                        responsive: true,
                        pageLength: 25,
                        pagingType: "simple", 
                      
                    });
                    
                    
                    $('[data-toggle="tooltip"]').tooltip();
                    }); 
            </script>
        </div>





