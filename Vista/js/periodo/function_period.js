let originalValues = {};

function loadFormPeriodo(id) {
    let container = $("#frmArea");
    let url =
        id === "none"
            ? "period/frmPeriod.php"
            : id === "mod"
                ? "period/modPeriodo.php?id="
                : "";

    if (!url) return;

    container.fadeOut(300, function () {
        clearArea("frmArea"); // Limpia el área antes de cargar contenido

        fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: id}),
        })
            .then((response) => response.text())
            .then((responseText) => {
                try {
                    container
                        .html(responseText)
                        .hide()
                        .fadeIn(500)
                        .css("transform", "translateY(-10px)")
                        .animate(
                            {
                                opacity: 1,
                                transform: "translateY(0px)",
                            },
                            300,
                            function () {

                                /*
                                // **Inicializar datepickers después de la animación**
                                $(".datepicker").datepicker({
                                    format: "yyyy-mm-dd",
                                    autoclose: true,
                                    language: "es",
                                });
                                */

                                // **Llamada al método para calcular el periodo**
                                obtenerPeriodo();

                                // Ahora agregamos el evento al campo txtPeriodo
                                const txtPeriodo = document.getElementById("txtPeriodo");

                                if (txtPeriodo) {
                                    txtPeriodo.addEventListener("input", function () {
                                        // En lugar de reemplazar automáticamente, llamamos a la función de validación
                                        validarCaracteres(this);
                                    });
                                }
                            }
                        );
                } catch (error) {
                    mostrarErrorCaptura("Error al cargar el formulario: " + error);
                }
            })
            .catch((error) => {
                mostrarErrorCaptura("Error de conexión: " + error);
            });
    });
}

/**
 * Función para cambiar el estado de un período con confirmación
 * @param {string} id - ID del período a modificar
 * @param {string} status - Nuevo estado seleccionado
 * @param {string} currentStatus - Estado actual del período
 */
function changeStatus(pid, pestado, currentStatus) {
    // Si no hay un estado seleccionado (opción por defecto), no hacer nada
    if (!pestado || pestado === "Cambiar estado") {
        return;
    }

    // Verificar si el estado actual es Cancelado o Cerrado
    if (currentStatus === "Cancelado" || currentStatus === "Cerrado") {
        // Mostrar mensaje de error
        mostrarErrorCaptura(
            `No se puede cambiar el estado del período ${pid} porque su estado actual es "${currentStatus}".`
        );

        // Resetear el select
        const selectElement = document.querySelector(
            `select[onchange="changeStatus('${pid}', this.value, '${currentStatus}')"]`
        );
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
        return;
    }

    // Crear el contenido del modal de confirmación
    let modalHTML = `
    <div class="modal fade" id="confirmStatusModal" tabindex="-1" aria-labelledby="confirmStatusModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-warning text-dark">
                    <h5 class="modal-title" id="confirmStatusModalLabel">
                        <i class="fas fa-exclamation-triangle me-2"></i>Confirmar cambio de estado
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-3">
                        <i class="fas fa-sync-alt text-warning fa-4x"></i>
                    </div>
                    <p class="text-center">¿Está seguro de cambiar el estado del período <strong>${pid}</strong> a <strong>${pestado}</strong>?</p>
                    <p class="text-center text-danger">Esta acción puede afectar a los procesos académicos en curso.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="btnCancelar">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btnConfirmar">Confirmar</button>
                </div>
            </div>
        </div>
    </div>`;

    // Remover modal anterior si existe
    let modalAnterior = document.getElementById("confirmStatusModal");
    if (modalAnterior) {
        modalAnterior.remove();
    }

    // Agregar el modal al documento
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Mostrar el modal
    let modalElement = document.getElementById("confirmStatusModal");
    let modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Configurar acción para el botón cancelar
    document.getElementById("btnCancelar").addEventListener("click", function () {
        // Resetear el select al cancelar
        const selectElement = document.querySelector(
            `select[onchange="changeStatus('${pid}', this.value, '${currentStatus}')"]`
        );
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
    });

    // También resetear al cerrar el modal con la X o haciendo clic fuera
    modalElement.addEventListener("hidden.bs.modal", function () {
        const selectElement = document.querySelector(
            `select[onchange="changeStatus('${pid}', this.value, '${currentStatus}')"]`
        );
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
        modalElement.remove();
    });

    // Configurar acción para el botón confirmar
    document
        .getElementById("btnConfirmar")
        .addEventListener("click", function () {
            // Cerrar el modal
            modal.hide();

            // Preparar datos para enviar
            let data = {
                pid: pid,
                pestado: pestado,
            };

            // Convertir a JSON
            let json = JSON.stringify(data);

            console.log(`Cambiando estado de período ${pid} a ${pestado}`);

            let url = "../../Controlador/Intermediarios/Periodo/CambiarEstado.php";

            // Enviar datos por json al script CambiarEsatdo.php
            $.post(url, json, function (responseText, status) {
                console.log("Respuesta recibida:");
                console.log("Estado de la petición:", status);
                console.log("Texto de respuesta:", responseText);

                try {
                    // Verificar si la respuesta es JSON válido
                    let respuesta = JSON.parse(responseText.trim()); // Trim para eliminar cualquier espacio extra
                    console.log("Respuesta parseada:", respuesta);

                    if (respuesta.estado === "OK") {
                        mostrarDatosGuardados(
                            `El estado del período ${pid} ha sido cambiado a "${pestado}" correctamente.`,
                            function () {
                                // Recargar la tabla de periodos después de la actualización exitosa
                                option("period", "");
                            }
                        );
                    } else {
                        mostrarErrorCaptura(
                            `Error: ${respuesta.mensaje || "No se pudo cambiar el estado."}`
                        );
                    }
                } catch (error) {
                    // Mostrar el error y el contenido de la respuesta para depuración
                    console.error("Error al parsear JSON:", error);
                    console.error("Respuesta problemática:", responseText);
                    mostrarErrorCaptura(
                        "Error al Cambiar Estado. Por favor, inténtalo de nuevo más tarde. " +
                        error.message
                    );
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                mostrarErrorCaptura(
                    "Hubo un error de conexión. Asegúrate de estar conectado a Internet e intenta nuevamente. " +
                    textStatus +
                    " - " +
                    errorThrown
                );
            });
        });
}

function AgregarPeriodo(mensaje) {
    // Obtener los valores de los campos del formulario
    const id = document.getElementById("txtId").value.trim();
    const periodo = document.getElementById("txtPeriodo").value.trim();
    const fechaInicio = document.getElementById("txtFechaInicio").value.trim();
    const fechaTermino = document.getElementById("txtFechaTermino").value.trim();
    const fechaInicioAjuste = document.getElementById("txtFechaInicioAjuste").value.trim();
    const fechaFinalAjuste = document.getElementById("txtFechaFinalAjuste").value.trim();

    
    // Llamar a la función de validación de fechas
    const resultadoValidacion = validarFechasAgregar(
        fechaInicio,
        fechaTermino,
        fechaInicioAjuste,
        fechaFinalAjuste
    );

    // Si la validación de fechas falla, mostrar mensaje de error y detener el proceso
    if (resultadoValidacion !== true) {
        mostrarFaltaDatos(resultadoValidacion); // Mostrar mensaje de error
        return false; // Detener el proceso de guardado
    }

    //Guardar los datos del fomulario en la bd
    try {
        let url = "../../Controlador/Intermediarios/Periodo/AgregarPeriodo.php";
        let datos = new Object();
        datos.id = id;
        datos.periodo = periodo;
        datos.fechaInicio = fechaInicio;
        datos.fechaTermino = fechaTermino;
        datos.fechaInicioAjuste = fechaInicioAjuste;
        datos.fechaFinalAjuste = fechaFinalAjuste;

        let json = JSON.stringify(datos);

        $.post(url, json, function (responseText, status) {
            console.log("Datos a enviar:", JSON.stringify(datos));
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
                console.log(
                    "Recibiendo datos:" +
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

                if (
                    response.datos.estado === "Abierto" ||
                    response.datos.estado === "Pendiente"
                ) {
                    bloquearFormulario(false, true);

                    // Almacenar los valores originales después de que el formulario se ha llenado
                    storeOriginalValues();

                    // Configurar los listeners para detectar cambios
                    setupFormChangeListeners();
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
    const fechaInicioAjuste = document.getElementById("txtFechaInicioAjuste").value.trim();
    const fechaFinalAjuste = document.getElementById("txtFechaFinalAjuste").value.trim();

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
                mostrarDatosGuardados(mensaje, function () {
                    option("period", "");
                });
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

//Funcion para validar fechas (JC)
function validarFechasModificar() {
    const fechaHoy = new Date();
    const fechaInicio = new Date(document.getElementById("txtFechaInicio").value);
    const fechaTermino = new Date(
        document.getElementById("txtFechaTermino").value
    );
    const fechaInicioAjuste = new Date(
        document.getElementById("txtFechaInicioAjuste").value
    );
    const fechaFinalAjuste = new Date(
        document.getElementById("txtFechaFinalAjuste").value
    );

    // Validar Fecha de Inicio Semestre
    if (fechaInicio <= fechaHoy || ![0, 7].includes(fechaInicio.getMonth())) {
        mostrarErrorCaptura(
            "La fecha de inicio del semestre debe ser un día en enero o agosto y mayor a la fecha actual."
        );
        return false;
    }

    // Validar Fecha de Término Semestre
    if (fechaTermino <= fechaHoy || ![5, 11].includes(fechaTermino.getMonth())) {
        mostrarErrorCaptura(
            "La fecha de término del semestre debe ser un día en junio o diciembre y mayor a la fecha actual."
        );
        return false;
    }

    // Validar Fecha de Inicio de Ajustes (máximo 7 días después de inicio)
    const maxFechaInicioAjuste = new Date(fechaInicio);
    maxFechaInicioAjuste.setDate(maxFechaInicioAjuste.getDate() + 7);
    if (
        fechaInicioAjuste < fechaInicio ||
        fechaInicioAjuste > maxFechaInicioAjuste
    ) {
        mostrarErrorCaptura(
            "La fecha de inicio de ajustes debe ser el mismo día de inicio del semestre o hasta 7 días después."
        );
        return false;
    }

    // Validar Fecha de Término de Ajustes (entre 1 y 22 días después del inicio de ajustes)
    const maxFechaFinalAjuste = new Date(fechaInicioAjuste);
    maxFechaFinalAjuste.setDate(maxFechaFinalAjuste.getDate() + 22);
    if (
        fechaFinalAjuste <= fechaInicioAjuste ||
        fechaFinalAjuste > maxFechaFinalAjuste
    ) {
        mostrarErrorCaptura(
            "La fecha de término de ajustes debe ser mayor a la fecha de inicio de ajustes y no exceder 22 días después."
        );
        return false;
    }

    return true;
}

// Función para validar las fechas de inicio y término
function validarFechasAgregar(
    fechaInicio,
    fechaTermino,
    fechaInicioAjuste,
    fechaTerminoAjuste
) {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const hoy = new Date().toISOString().split("T")[0];

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

    // La fecha de término del semestre y la de ajustes NO pueden ser iguales
    if (fechaTermino === fechaTerminoAjuste) {
        return "La fecha de término de ajustes no puede ser la misma que la fecha de término del semestre.";
    }

    return true; // Todas las validaciones pasaron
}

// Función para validar si la fecha es un día válido en el semestre (agosto/enero o junio/diciembre)
function validarFechaSemestre(fecha, hoy, mesesPermitidos) {
    if (fecha <= hoy) return false;
    const mes = parseInt(fecha.split("-")[1], 10);
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

function validarCaracteres(input) {
    // Patrón para permitir solo letras, números, espacios y guiones
    const patron = /^[A-Za-záéíóúÁÉÍÓÚÑñ0-9\- ]*$/;

    // Obtener el botón de guardar
    const btnGuardar = document.querySelector('button[onclick*="validafrmPeriodo"]');

    // Verificar si el valor actual cumple con el patrón
    if (!patron.test(input.value)) {
        // Si hay caracteres no permitidos, mostrar mensaje de error
        input.setCustomValidity("Caracteres no permitidos");
        input.classList.add("is-invalid");
        document.getElementById("periodoFeedback").style.display = "block";

        // Desactivar el botón de guardar independientemente de otras modificaciones
        if (btnGuardar) {
            btnGuardar.disabled = true;
        }
    } else {
        // Si es válido, quitar mensaje de error
        input.setCustomValidity("");
        input.classList.remove("is-invalid");
        document.getElementById("periodoFeedback").style.display = "none";

        // En lugar de activar directamente, verificar si el formulario ha sido modificado
        checkFormModified();
    }
}

// Función para almacenar los valores originales después de cargar el formulario
function storeOriginalValues() {
    originalValues = {
        periodo: document.getElementById("txtPeriodo").value,
        fechaInicio: document.getElementById("txtFechaInicio").value,
        fechaTermino: document.getElementById("txtFechaTermino").value,
        fechaInicioAjuste: document.getElementById("txtFechaInicioAjuste").value,
        fechaFinalAjuste: document.getElementById("txtFechaFinalAjuste").value
    };

    // Inicialmente deshabilitamos el botón ya que no hay cambios
    document.getElementById("btnActualizar").disabled = true;
}

// Función para verificar si el formulario ha sido modificado
function checkFormModified() {
    const currentValues = {
        periodo: document.getElementById("txtPeriodo").value,
        fechaInicio: document.getElementById("txtFechaInicio").value,
        fechaTermino: document.getElementById("txtFechaTermino").value,
        fechaInicioAjuste: document.getElementById("txtFechaInicioAjuste").value,
        fechaFinalAjuste: document.getElementById("txtFechaFinalAjuste").value
    };

    // Comparar cada valor
    const isModified =
        currentValues.periodo !== originalValues.periodo ||
        currentValues.fechaInicio !== originalValues.fechaInicio ||
        currentValues.fechaTermino !== originalValues.fechaTermino ||
        currentValues.fechaInicioAjuste !== originalValues.fechaInicioAjuste ||
        currentValues.fechaFinalAjuste !== originalValues.fechaFinalAjuste;

    // Habilitar/deshabilitar botón según el estado de modificación
    document.getElementById("btnActualizar").disabled = !isModified;
}

// Función para agregar oyentes de eventos a todos los campos del formulario
function setupFormChangeListeners() {
    const formElements = [
        "txtPeriodo",
        "txtFechaInicio",
        "txtFechaTermino",
        "txtFechaInicioAjuste",
        "txtFechaFinalAjuste"
    ];

    formElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            // Usar evento input para campos de texto y change para fechas

            element.addEventListener("input", checkFormModified);
            element.addEventListener("change", checkFormModified);
        }
    });
}

