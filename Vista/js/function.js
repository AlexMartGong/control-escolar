/**
 * Función para cargar contenido dinámicamente en la página
 * @param {string} opc - Opción seleccionada (career, period, etc.)
 * @param {string} filter - Filtro opcional para la consulta
 */
function option(opc, filter) {
    try {
        if (typeof $ === 'undefined') {
            console.error('jQuery no está cargado');
            alert('Error: jQuery no está disponible');
            return;
        }

        let mainContent = $('#mainContent'); // Usamos jQuery para manipulación más fácil
        if (!mainContent.length) {
            console.error('Elemento mainContent no encontrado');
            return;
        }

        let url = "";
        switch (opc) {
            case 'career':
                url = "career/main.php";
                break;
            case 'period':
                url = "period/main.php";
                break;
            case 'period-add':
                url = "period/frmPeriod.php";
                break;
            case 'period-edit':
                url = "period/modPeriodo.php?id=" + filter;
                break;
            case 'career-manager':
                url = "career-manager/main.php";
                break;
            default:
                mainContent.html('<div class="alert alert-warning">Opción no válida</div>');
                return;
        }

        let data = {filter: filter || ""};
        let json = JSON.stringify(data);
        console.log(`Cargando ${opc} con filtro: ${json}`);

        // Animación: desvanecer el contenido actual antes de limpiarlo
        mainContent.fadeOut(300, function () {
            mainContent.html('<div class="text-center"><i class="fas fa-spinner fa-spin fa-3x"></i><p class="mt-2">Cargando...</p></div>').fadeIn(200);

            $.ajax({
                url: url,
                type: 'POST',
                data: json,
                contentType: 'application/json',
                timeout: 10000, // 10 segundos de timeout
                success: function (responseText) {
                    // Animación: desvanecer el spinner antes de mostrar el nuevo contenido
                    mainContent.fadeOut(300, function () {
                        mainContent.html(responseText).fadeIn(300);

                        // Llamar a obtenerPeriodo después de que el contenido se ha cargado
                        obtenerPeriodo();

                        // Inicializar DataTables después de la animación
                        if ($.fn.DataTable) {
                            try {
                                const commonConfig = {
                                    language: {url: "https://cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json"},
                                    responsive: true,
                                    pageLength: 25,
                                    order: [[0, 'desc']],
                                    lengthMenu: [[25, 50, 100, -1], [25, 50, 100, "Todos"]]
                                };

                                if (opc === 'career' && $('#tableCareer').length) {
                                    $('#tableCareer').DataTable(commonConfig);
                                }
                                if (opc === 'career-manager' && $('#tableCareerManager').length) {
                                    $('#tableCareerManager').DataTable(commonConfig);
                                }
                                if (opc === 'period' && $('#tablePeriod').length) {
                                    $('#tablePeriod').DataTable({
                                        ...commonConfig,
                                        columnDefs: [
                                            {"searchable": true, "targets": [1]},
                                            {"searchable": false, "targets": "_all"}
                                        ]
                                    });
                                }

                                $('table.dataTable').not('#tableCareer, #tableCareerManager, #tablePeriod').each(function () {
                                    if (!$.fn.DataTable.isDataTable(this)) {
                                        $(this).DataTable(commonConfig);
                                    }
                                });
                            } catch (tableError) {
                                console.error("Error al inicializar DataTable:", tableError);
                            }
                        }
                    });
                },
                error: function (xhr, status, error) {
                    mainContent.fadeOut(300, function () {
                        mainContent.html(`
                            <div class="alert alert-danger">
                                <h4>Error al cargar el contenido</h4>
                                <p>Estado: ${status}</p>
                                <p>Error: ${error}</p>
                            </div>
                        `).fadeIn(300);
                    });
                    console.error(`Error en la petición: ${status} - ${error}`);
                }
            });
        });

    } catch (e) {
        console.error("Error general:", e);
        alert("Ocurrió un error: " + e.message);
    }
}

/**
 * Función para validar el formulario de periodo
 * Integración con la función existente validafrmPeriodo
 */
function validafrmPeriodo(mensaje, tipoOp) {
    switch (tipoOp) {
        case "Agregar":
            console.log("Voy a comenzar a Agregar");

            return AgregarPeriodo(mensaje);

        case "Modificar":
            console.log("Voy a comenzar a Modificar");

            return ModificarPeriodo(mensaje);

        default:
            return false;
    }
}

function AgregarPeriodo(mensaje) {
    // Obtener los valores de los campos del formulario
    const periodo = document.getElementById("txtPeriodo").value.trim();
    const fechaInicio = document.getElementById("txtFechaInicio").value.trim();
    const fechaTermino = document.getElementById("txtFechaTermino").value.trim();
    const fechaInicioAjuste = document
        .getElementById("txtFechaInicioAjuste")
        .value.trim();
    const fechaFinalAjuste = document
        .getElementById("txtFechaFinalAjuste")
        .value.trim();

    // Validar campos obligatorios
    if (!periodo || !fechaInicio || !fechaTermino || !fechaInicioAjuste || !fechaFinalAjuste) {
        mostrarFaltaDatos('Por favor, complete todos los campos obligatorios para continuar.');
        return false;
    }

    // Llamar a la función de validación de fechas
    const resultadoValidacion = validarFechasAgregar(fechaInicio, fechaTermino, fechaInicioAjuste, fechaFinalAjuste);

    // Si la validación de fechas falla, mostrar mensaje de error y detener el proceso
    if (resultadoValidacion !== true) {
        mostrarFaltaDatos(resultadoValidacion); // Mostrar mensaje de error
        return false; // Detener el proceso de guardado
    }

    //Guardar los datos del fomulario en la bd
    try {
        let url = "../../Controlador/Intermediarios/Periodo/AgregarPeriodo.php";
        let datos = new Object();
        datos.periodo = periodo;
        datos.fechaInicio = fechaInicio;
        datos.fechaTermino = fechaTermino;
        datos.fechaInicioAjuste = fechaInicioAjuste;
        datos.fechaFinalAjuste = fechaFinalAjuste;

        let json = JSON.stringify(datos);

        $.post(url, json, function (responseText, status) {
            console.log("Datos a enviar:", JSON.stringify(datos));
            console.log("Respuesta recibida:");
            console.log("Estado de la petición:", status);
            console.log("Texto de respuesta:", responseText);

            try {
                if (status === "success") {
                    let respuesta = JSON.parse(responseText);
                    console.log("Respuesta parseada:", respuesta);

                    if (respuesta.estado === "OK") {
                        mostrarDatosGuardados(mensaje, function () {
                            option("period", "");
                        });

                        console.log("Datos guardados correctamente en la BD.");
                    }
                }
            } catch (error) {
                // Mostrar mensaje de error con el detalle del problema
                mostrarErrorCaptura(
                    "Error de Captura. Por favor, inténtalo de nuevo más tarde. " +
                    error.message
                );
                return false;
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // Mostrar mensaje de error con los detalles de la falla
            mostrarErrorCaptura(
                "Hubo un error de conexión. Asegúrate de estar conectado a Internet e intenta nuevamente. " +
                textStatus +
                " - " +
                errorThrown
            );
            return false;
        });
    } catch (error) {
        mostrarErrorCaptura(
            "Error de Captura. Ocurrio un error fatal. " + error.message
        );
        return false;
    }

    return true;
}

//Funcion para buscar periodo (JC)
function buscarPeriodo() {
    let id = document.getElementById("txtId").value.trim();
    let nombre = document.getElementById("txtPeriodo").value.trim();
    let url = "../../Controlador/Intermediarios/Periodo/ModificarPeriodo.php";

    let datos = id ? {id: id, buscar: true} : {nombre: nombre, buscar: true};
    let json = JSON.stringify(datos);

    $.post(
        url,
        json,
        function (response, status) {
            console.log("Respuesta del servidor:", response);

            if (status == "success") {
                console.log("Recibiendo datos:" +
                    response.datos.clave_periodo +
                    response.datos.periodo +
                    response.datos.fecha_de_inicio +
                    response.datos.fecha_de_termino +
                    response.datos.fecha_de_inicio_ajustes +
                    response.datos.fecha_de_termino_ajustes +
                    response.datos.estado
                );

                // Asigna los valores a los campos del formulario correctamente
                document.getElementById("txtId").value = response.datos.clave_periodo;
                document.getElementById("txtPeriodo").value = response.datos.periodo;
                document.getElementById("txtFechaInicio").value = response.datos.fecha_de_inicio;
                document.getElementById("txtFechaTermino").value = response.datos.fecha_de_termino;
                document.getElementById("txtFechaInicioAjuste").value = response.datos.fecha_de_inicio_ajustes;
                document.getElementById("txtFechaFinalAjuste").value = response.datos.fecha_de_termino_ajustes;
                document.getElementById("txtEstatus").value = response.datos.estado;

                if (response.datos.estado === "Abierto" || response.datos.estado === "Pendiente") {
                    bloquearFormulario(false, true);
                } else {
                    errorActualizacion(
                        "No se puede modificar este periodo porque su estatus es: " +
                        response.datos.estado
                    );
                    bloquearFormulario(true, false);
                }
            } else {
                console.warn("No se encontraron datos válidos.");
                sinres("No se encontraron coincidencias.");
            }

        },
        "json" // Indica que la respuesta esperada es JSON
    ).fail(function (xhr, status, error) {
        // Manejo de error
        console.error("Error en la solicitud POST:", xhr.responseText);
        mostrarErrorCaptura("Error al buscar el periodo.");
    });
}

// Funcion para guardar periodo (JC)
function ModificarPeriodo(mensaje) {
    if (!validarFechasModificar()) return false;

    const estatus = document.getElementById("txtEstatus").value.trim();

    if (estatus !== "Abierto" && estatus !== "Pendiente") {
        errorActualizacion(
            "No se puede guardar cambios en este periodo porque su estatus es: " +
            estatus
        );
        return false;
    }
    //capturar los valores de los campos
    const id = document.getElementById("txtId").value.trim();
    const periodo = document.getElementById("txtPeriodo").value.trim();
    const fechaInicio = document.getElementById("txtFechaInicio").value.trim();
    const fechaTermino = document.getElementById("txtFechaTermino").value.trim();
    const fechaInicioAjuste = document
        .getElementById("txtFechaInicioAjuste")
        .value.trim();
    const fechaFinalAjuste = document
        .getElementById("txtFechaFinalAjuste")
        .value.trim();

    // Validar campos obligatorios
    if (
        !periodo ||
        !fechaInicio ||
        !fechaTermino ||
        !fechaInicioAjuste ||
        !fechaFinalAjuste
    ) {
        mostrarFaltaDatos(
            "Por favor, complete todos los campos obligatorios para continuar."
        );
        return false;
    }

    let datos = {
        idPeriodo: id,
        periodo: periodo,
        fechaInicio: fechaInicio,
        fechaTermino: fechaTermino,
        fechaInicioAjustes: fechaInicioAjuste,
        fechaTerminoAjustes: fechaFinalAjuste,
        guardar: true,
    };

    let json = JSON.stringify(datos);
    let url = "../../Controlador/Intermediarios/Periodo/ModificarPeriodo.php";

    $.post(
        url,
        json,
        function (response, status) {

            if (response.success) {
                mostrarDatosGuardados(
                    mensaje,
                    function () {
                        option("period", "");
                    }
                );
            } else {
                mostrarErrorCaptura("Error al Modificar el período.");
                return false;
            }

        },
        "json" // Indica que la respuesta esperada es JSON
    ).fail(function (xhr, status, error) {
        // Manejo de error
        console.error("Error en la solicitud POST:", xhr.responseText);
        mostrarErrorCaptura("Error al Modificar el periodo.");
    });

    return true;
}

//Funcion de bloquear formulario (JC)
function bloquearFormulario(bloquearTodo, soloIDyPeriodo) {
    document.getElementById("txtId").disabled = soloIDyPeriodo || bloquearTodo;
    document.getElementById("txtPeriodo").disabled = soloIDyPeriodo || bloquearTodo;
    document.getElementById("txtFechaInicio").disabled = bloquearTodo;
    document.getElementById("txtFechaTermino").disabled = bloquearTodo;
    document.getElementById("txtFechaInicioAjuste").disabled = bloquearTodo;
    document.getElementById("txtFechaFinalAjuste").disabled = bloquearTodo;
    document.getElementById("btnActualizar").disabled = bloquearTodo;
}

function validarBusqueda() {
    // Obtener los valores de los campos del formulario
    const id = document.getElementById("txtId").value.trim();
    const periodo = document.getElementById("txtPeriodo").value.trim();
    // Validar campos obligatorios
    if (!id && !periodo) {
        mostrarFaltaDatos('Ingrese el "ID periodo" o "Periodo" correctamente"');
        return false;
    }

    // Validar que si hay un ID ingresado, sea un número
    if (id && isNaN(id)) {
        mostrarErrorCaptura("Por favor, ingrese un ID válido (solo números).");
        return false;
    }

    //Mandar a llamar el metodo buscarPeriodo
    buscarPeriodo();
}

/**
 * Función para obtener el Nombre del Periodo en base a la fecha que se obtiene del sistema
 */
function obtenerPeriodo() {
    let fechaActual = new Date();
    let mes = fechaActual.getMonth() + 1; // Enero es 0, por eso sumamos 1
    let anio = fechaActual.getFullYear();
    let periodo = "";

    if (mes >= 2 && mes <= 7) {
        // Si estamos entre Febrero (2) y Julio (7), el periodo es Febrero - Julio del mismo año
        periodo = `Agosto ${anio} - Enero ${anio + 1}`;
    } else {
        // Si estamos entre Agosto (8) y Enero (1), el periodo es Agosto del año actual - Enero del siguiente año
        periodo = `Febrero ${anio} - Julio ${anio}`;
    }

    // Asignar el nombre del periodo al campo de texto
    let txtPeriodo = document.getElementById("txtPeriodo");
    if (txtPeriodo) {
        txtPeriodo.value = periodo;
    }
}

//Modal que se muestra si no se encontraron resultados en la Base de datos
function sinres(mensaje) {
    // Crear el contenido del modal
    let modalHTML = ` 
        <div class="modal fade" id="errorCapturaModal" tabindex="-1" aria-labelledby="errorCapturaModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="errorCapturaModalLabel">
                            <i class="fas fa-exclamation-triangle me-2"></i>SIN COINCIDENCIAS
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-2 me-5">
                            <i class="fas fa-times-circle text-primary fa-4x"></i>
                        </div>
                        <p class="text-center">${mensaje}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>`;

    // Remover modal anterior si existe
    let modalAnterior = document.getElementById("errorCapturaModal");
    if (modalAnterior) {
        modalAnterior.remove();
    }

    // Agregar el modal al documento
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Mostrar el modal
    let modalElement = document.getElementById("errorCapturaModal");
    let modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Eliminar el modal del DOM cuando se cierre
    modalElement.addEventListener("hidden.bs.modal", function () {
        modalElement.remove();
    });
}

//Funcion para validar fechas (JC)
function validarFechasModificar() {
    const fechaHoy = new Date();
    const fechaInicio = new Date(document.getElementById('txtFechaInicio').value);
    const fechaTermino = new Date(document.getElementById('txtFechaTermino').value);
    const fechaInicioAjuste = new Date(document.getElementById('txtFechaInicioAjuste').value);
    const fechaFinalAjuste = new Date(document.getElementById('txtFechaFinalAjuste').value);

    // Validar Fecha de Inicio Semestre
    if (fechaInicio <= fechaHoy || ![0, 7].includes(fechaInicio.getMonth())) {
        mostrarErrorCaptura("La fecha de inicio del semestre debe ser un día en enero o agosto y mayor a la fecha actual.");
        return false;
    }

    // Validar Fecha de Término Semestre
    if (fechaTermino <= fechaHoy || ![5, 11].includes(fechaTermino.getMonth())) {
        mostrarErrorCaptura("La fecha de término del semestre debe ser un día en junio o diciembre y mayor a la fecha actual.");
        return false;
    }

    // Validar Fecha de Inicio de Ajustes (máximo 7 días después de inicio)
    const maxFechaInicioAjuste = new Date(fechaInicio);
    maxFechaInicioAjuste.setDate(maxFechaInicioAjuste.getDate() + 7);
    if (fechaInicioAjuste < fechaInicio || fechaInicioAjuste > maxFechaInicioAjuste) {
        mostrarErrorCaptura("La fecha de inicio de ajustes debe ser el mismo día de inicio del semestre o hasta 7 días después.");
        return false;
    }

    // Validar Fecha de Término de Ajustes (entre 1 y 22 días después del inicio de ajustes)
    const maxFechaFinalAjuste = new Date(fechaInicioAjuste);
    maxFechaFinalAjuste.setDate(maxFechaFinalAjuste.getDate() + 22);
    if (fechaFinalAjuste <= fechaInicioAjuste || fechaFinalAjuste > maxFechaFinalAjuste) {
        mostrarErrorCaptura("La fecha de término de ajustes debe ser mayor a la fecha de inicio de ajustes y no exceder 22 días después.");
        return false;
    }

    return true;
}

// Función para validar las fechas de inicio y término
function validarFechasAgregar(fechaInicio, fechaTermino, fechaInicioAjuste, fechaTerminoAjuste) {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const hoy = new Date().toISOString().split('T')[0];

    // Validar fecha de inicio (debe ser mayor a hoy y estar en agosto o enero)
    if (!validarFechaSemestre(fechaInicio, hoy, [8, 1])) {
        return "La fecha de inicio debe ser mayor a hoy y estar en agosto o enero.";
    }

    // Validar fecha de término (debe ser mayor a hoy y estar en junio o diciembre)
    if (!validarFechaSemestre(fechaTermino, hoy, [6, 12])) {
        return "La fecha de término debe ser mayor a hoy y estar en junio o diciembre.";
    }

    // Validar fecha de inicio de ajustes (puede ser igual a la de inicio y no mayor a 7 días)
    if (!validarFechaAjustesInicio(fechaInicioAjuste, fechaInicio, 7)) {
        return "La fecha de inicio de ajustes debe ser igual a la fecha de inicio del semestre o estar dentro de los 7 días posteriores.";
    }

    // Validar fecha de término de ajustes (debe ser mayor a la de inicio de ajustes y no mayor a 22 días)
    if (!validarFechaAjustesTermino(fechaTerminoAjuste, fechaInicioAjuste, 22)) {
        return "La fecha de término de ajustes debe ser mayor a la fecha de inicio de ajustes y no mayor a 22 días.";
    }

    // ❗ Nueva validación: La fecha de término del semestre y la de ajustes NO pueden ser iguales
    if (fechaTermino === fechaTerminoAjuste) {
        return "La fecha de término de ajustes no puede ser la misma que la fecha de término del semestre.";
    }

    return true; // Todas las validaciones pasaron
}

// Función para validar si la fecha es un día válido en el semestre (agosto/enero o junio/diciembre)
function validarFechaSemestre(fecha, hoy, mesesPermitidos) {
    if (fecha <= hoy) return false;
    const mes = parseInt(fecha.split('-')[1], 10);
    return mesesPermitidos.includes(mes);
}

// Función para validar fecha de inicio de ajustes (debe ser igual a la fecha de inicio o estar dentro de los 7 días)
function validarFechaAjustesInicio(fechaAjuste, fechaReferencia, diasMax) {
    if (fechaAjuste < fechaReferencia) return false;
    const diferencia = calcularDiferenciaDias(fechaReferencia, fechaAjuste);
    return diferencia <= diasMax;
}

// Función para validar fecha de término de ajustes (debe ser mayor a la fecha de inicio de ajustes y no mayor a 22 días)
function validarFechaAjustesTermino(fechaAjuste, fechaReferencia, diasMax) {
    if (fechaAjuste <= fechaReferencia) return false;
    const diferencia = calcularDiferenciaDias(fechaReferencia, fechaAjuste);
    return diferencia <= diasMax;
}

// Función auxiliar para calcular la diferencia en días entre dos fechas
function calcularDiferenciaDias(fechaInicio, fechaFin) {
    const fecha1 = new Date(fechaInicio);
    const fecha2 = new Date(fechaFin);
    return (fecha2 - fecha1) / (1000 * 60 * 60 * 24); // Diferencia en días
}


function clearArea(myArea) {
    document.getElementById(myArea).innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("show");
        });

        // Cerrar menú al hacer clic en un enlace (en dispositivos móviles)
        const navLinks = sidebar.querySelectorAll(".nav-link");
        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth < 992) {
                    sidebar.classList.remove("show");
                }
            });
        });

        // Cerrar menú al hacer clic fuera del mismo
        document.addEventListener("click", function (event) {
            const isClickInsideMenu = sidebar.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (
                !isClickInsideMenu &&
                !isClickOnToggle &&
                sidebar.classList.contains("show")
            ) {
                sidebar.classList.remove("show");
            }
        });
    }

    // Ajustar diseño cuando cambia el tamaño de la ventana
    window.addEventListener("resize", function () {
        if (window.innerWidth >= 992 && sidebar.classList.contains("show")) {
            sidebar.classList.remove("show");
        }
    });
});

/**
 * Función para mostrar ventana modal de error de captura
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarErrorCaptura(mensaje) {
    // Crear el contenido del modal
    let modalHTML = `
    <div class="modal fade" id="errorCapturaModal" tabindex="-1" aria-labelledby="errorCapturaModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title" id="errorCapturaModalLabel">
                        <i class="fas fa-exclamation-triangle me-2"></i>Error de Captura
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-3">
                        <i class="fas fa-times-circle text-danger fa-4x"></i>
                    </div>
                    <p class="text-center">${mensaje ||
    "Se ha producido un error durante la captura de datos."
    }</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>`;

    // Remover modal anterior si existe
    let modalAnterior = document.getElementById("errorCapturaModal");
    if (modalAnterior) {
        modalAnterior.remove();
    }

    // Agregar el modal al documento
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Mostrar el modal
    let modalElement = document.getElementById("errorCapturaModal");
    let modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Eliminar el modal del DOM cuando se cierre
    modalElement.addEventListener("hidden.bs.modal", function () {
        modalElement.remove();
    });
}

/**
 * Función para mostrar ventana de alerta por falta de datos
 * @param {string} mensaje - Mensaje específico sobre los datos faltantes
 * @param {Function} callback - Función a ejecutar al confirmar (opcional)
 */
function mostrarFaltaDatos(mensaje, callback) {
    // Crear el contenido del modal
    let modalHTML = `
    <div class="modal fade" id="faltaDatosModal" tabindex="-1" aria-labelledby="faltaDatosModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-warning text-dark">
                    <h5 class="modal-title" id="faltaDatosModalLabel">
                        <i class="fas fa-exclamation-circle me-2"></i>Datos Incompletos
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-3 me-3">
                        <i class="fas fa-clipboard-list text-warning fa-4x"></i>
                    </div>
                    <p class="text-center">${mensaje ||
    "Hay campos obligatorios sin completar. Por favor, revise el formulario."
    }</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="btnEntendido" data-bs-dismiss="modal">Entendido</button>
                </div>
            </div>
        </div>
    </div>`;

    // Remover modal anterior si existe
    let modalAnterior = document.getElementById("faltaDatosModal");
    if (modalAnterior) {
        modalAnterior.remove();
    }

    // Agregar el modal al documento
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Mostrar el modal
    let modalElement = document.getElementById("faltaDatosModal");
    let modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Configurar callback si se proporciona
    if (typeof callback === "function") {
        document.getElementById("btnEntendido").addEventListener("click", callback);
    }

    // Eliminar el modal del DOM cuando se cierre
    modalElement.addEventListener("hidden.bs.modal", function () {
        modalElement.remove();
    });
}

/**
 * Función para mostrar ventana de éxito cuando se guardan datos
 * @param {string} mensaje - Mensaje de éxito a mostrar
 * @param {Function} callback - Función a ejecutar al confirmar (opcional)
 */
function mostrarDatosGuardados(mensaje, callback) {
    // Crear el contenido del modal
    let modalHTML = `
    <div class="modal fade" id="datosGuardadosModal" tabindex="-1" aria-labelledby="datosGuardadosModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title" id="datosGuardadosModalLabel">
                        <i class="fas fa-check-circle me-2"></i>Operación Exitosa
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-3 me-4">
                        <i class="fas fa-save text-success fa-4x"></i>
                    </div>
                    <p class="text-center">${mensaje || "Los datos se han guardado correctamente."
    }</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="btnAceptar" data-bs-dismiss="modal">Aceptar</button>
                </div>
            </div>
        </div>
    </div>`;

    // Remover modal anterior si existe
    let modalAnterior = document.getElementById("datosGuardadosModal");
    if (modalAnterior) {
        modalAnterior.remove();
    }

    // Agregar el modal al documento
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Mostrar el modal
    let modalElement = document.getElementById("datosGuardadosModal");
    let modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Configurar callback si se proporciona
    if (typeof callback === "function") {
        document.getElementById("btnAceptar").addEventListener("click", callback);
    }

    // Eliminar el modal del DOM cuando se cierre
    modalElement.addEventListener("hidden.bs.modal", function () {
        modalElement.remove();
    });
}

function errorActualizacion(mensaje) {
    // Crear el contenido del modal
    let modalHTML = ` 
    <div class="modal fade" id="errorActualizacionModal" tabindex="-1" aria-labelledby="errorActualizacionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title" id="errorActualizacionModalLabel">
                        <i class="fas fa-exclamation-triangle me-2"></i>STATUS NO PERMITIDO
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-2 me-5">
                        <i class="fas fa-times-circle text-danger fa-4x"></i>
                    </div>
                    <p class="text-center text-danger">${mensaje}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>`;

    // Remover modal anterior si existe
    let modalAnterior = document.getElementById("errorActualizacionModal");
    if (modalAnterior) {
        modalAnterior.remove();
    }

    // Agregar el modal al documento
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Mostrar el modal
    let modalElement = document.getElementById("errorActualizacionModal");
    let modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Eliminar el modal del DOM cuando se cierre
    modalElement.addEventListener("hidden.bs.modal", function () {
        modalElement.remove();
    });
}

$(document).on('click', '.btnEditar', function () {
    let id = $(this).data('id');
    console.log("Click en editar. ID del periodo:", id);

    if (!$('#modPeriodo').length) {
        console.warn("⚠️ El modal #modPeriodo no existe en el DOM.");
    } else {
        console.log("✅ El modal #modPeriodo sí existe.");
    }

    $('#txtId').val(id);
    buscarPeriodo();

    // Probar manualmente si se puede abrir el modal
    $('#modPeriodo').modal('show');
});