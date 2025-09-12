//Autor Miguel Angel Lara H.
//Autor
//descripcion de funcionamiento
/*
Aqui se cargan los formularios de agregar y modificar, ademas se generan las validacions correspondientes
como validar campos vacion, que esten escritos correctamente y que sean igual que las validaciones se piden
tambien se inyecta codigo html y clases de css desde este archivo.

NUEVAS FUNCIONALIDADES PARA MODIFICACIÓN:
- validarEstadoParcialParaEdicion: Valida si un parcial puede ser editado según su estado
- validarPeriodoParaModificacion: Solo permite periodos pendientes o activos en modificación
- verificarParcialesEnPeriodo: Verifica el conteo de parciales por periodo
- cargarDatosParcial: Carga los datos del parcial a modificar
- validarFormularioModificacion: Validación específica para modificación

VALIDACIONES IMPLEMENTADAS:
1. No permitir edición de parciales en estado "Cerrado" o "Cancelado"
2. Solo permitir selección de periodos "Pendiente" o "Activo" en modificación
3. Validar límite de 4 parciales por periodo al cambiar periodo
4. Campos de solo lectura: id_parcial, estado_parcial
5. Campos editables: nombre_parcial, periodo_Id

USO:
- Para abrir formulario de modificación: loadFormParcial("modParcial", idParcial)
- Las validaciones se ejecutan automáticamente en tiempo real
*/

function loadFormParcial(opc, id = "") {
    let url = "";
    if (opc === "frmParcial") {
        url = "parcial/frmParcial.php";
    } else if (opc === "modParcial") {
        url = "parcial/modParcial.php";
    }

    let datas = {id: id};

    let container = $("#frmArea");

    container.fadeOut(300, function () {
        clearArea("frmArea");

        $.post(url, JSON.stringify(datas), function (responseText, status) {
            try {
                if (status === "success") {
                    container
                        .html(responseText)
                        .hide()
                        .fadeIn(500, function () {
                            // Si es modificación y tenemos un ID, cargar los datos
                            if (opc === "modParcial" && id) {
                                // Guardar el periodo original para validaciones posteriores
                                setTimeout(function() {
                                    cargarDatosParcial(id);
                                    const periodoOriginal = document.getElementById("idperiodo").value;
                                    document.getElementById("idperiodo").dataset.original = periodoOriginal;
                                }, 100);
                            }
                        })
                        .css("transform", "translateY(-10px)")
                        .animate(
                            {
                                opacity: 1,
                                transform: "translateY(0px)",
                            },
                            300
                        );
                }
            } catch (e) {
                mostrarErrorCaptura("Error al cargar el formulario: " + e);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            mostrarErrorCaptura(
                "Error de conexión: " + textStatus + " - " + errorThrown
            );
        });
    });
}

//funcion para validar antes de guardar que los datos sean los nesesarios.
function validarFormularioParcial(opc) {
    // Obtenemos los valores que el usuario ingreso por medio de las etiquetas
    const nombre_parcial = document.querySelector("#nombre_parcial");
    const periodo_Id = document.querySelector("#idperiodo");

    //se limpian los valores
    const nombre = nombre_parcial.value.trim();
    const periodo = periodo_Id.value.trim();
    //se crea un arreglo con los campos a validar

    const campos = [
        [nombre_parcial, nombre],
        [periodo_Id, periodo],
    ];

    const nadaVacio = campos.every(([_, valor]) => valor.trim() !== "");

    switch (opc) {
        case "guardar":
            if (!nadaVacio) {
                campos.forEach(([elemento, valor]) => {
                    marcarError(elemento, valor);
                });

                mostrarErrorCaptura(
                    "No se pueden dejar campos vacíos. Verifique e intente de nuevo."
                );
            } else {
                // Si todo está bien, se puede proceder a enviar el formulario
                btnGuardarJ.disabled = true; // Deshabilitar el botón para evitar múltiples envíos
                //logica para guardar el parcial
                //guardarParcial();
                mostrarDatosGuardados("Parcial guardado correctamente.");
            }
            break;
        case "modificar":
            // Usar la validación específica para modificación
            if (validarFormularioModificacion()) {
                const btnModificar = document.getElementById("btnModificarJ");
                btnModificar.disabled = true; // Deshabilitar el botón para evitar múltiples envíos
                //logica para modificar el parcial
                //modificarParcial();
                mostrarDatosGuardados("Parcial modificado correctamente");
            } else {
                // Los errores ya se muestran en validarFormularioModificacion
                campos.forEach(([elemento, valor]) => {
                    if (!valor.trim()) {
                        marcarError(elemento, valor);
                    }
                });
            }
            break;
    }
}

// funcion que permite evaluar los campos correctamente mientras escribe en el input
function validarEntrdasParcial(idetiqueta, idbtn, idperiodo, cont) {
    let input = document.getElementById(idetiqueta);
    const periodoInfo = document.getElementById(idperiodo);
    const valor = input.value.trim();

    const estaVacio = valor === "";
    const iconerror = document.querySelector(`#${idetiqueta}`);
    const contenedor = input.closest("." + cont);
    const errorPrevio = contenedor.querySelector(".errorscaracter");

    // Detectar si estamos en modo modificación
    const esModificacion = document.getElementById("id_parcial") !== null;

    if (errorPrevio) {
        errorPrevio.remove();
        input.classList.remove("entrada-error");
        iconerror.classList.remove("is-invalid");
    }

    // Validaciones por tipo de campo
    switch (idetiqueta) {
        case "nombre_parcial":
            const soloLetras = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/;
            if (estaVacio) {
                mostrarErrorparcial(input, "Este campo no puede estar vacío.");
                input.classList.add("entrada-error");
                iconerror.classList.add("is-invalid");
                return evaluarEstadoFormulario(idbtn);
            }
            if (!soloLetras.test(valor)) {
                mostrarErrorparcial(input, "No se permiten caracteres especiales.");
                input.classList.add("entrada-error");
                iconerror.classList.add("is-invalid");
                return evaluarEstadoFormulario(idbtn);
            }
            break;

        case "periodo_Id":
            const opcion = input.options[input.selectedIndex];
            const estado = opcion ? opcion.dataset.estado : "";
            
            // Validaciones específicas para modificación
            if (esModificacion) {
                // En modificación solo permitir estados pendiente y activo/abierto
                if (estado && !validarPeriodoParaModificacion(estado)) {
                    periodoInfo.textContent = "Solo se pueden seleccionar periodos pendientes o activos.";
                    setEstadoPeriodo("error");
                    iconerror.classList.add("is-invalid");
                    input.classList.add("entrada-error");
                    return evaluarEstadoFormulario(idbtn);
                }
                
                // Verificar límite de parciales solo si es un periodo diferente al original
                const periodoOriginal = document.getElementById("idperiodo").dataset.original || "";
                if (valor && valor !== periodoOriginal) {
                    const conteoActual = verificarParcialesEnPeriodo(valor);
                    if (conteoActual >= 4) {
                        periodoInfo.textContent = 
                            "Error: El periodo seleccionado ya tiene el máximo de 4 parciales.";
                        setEstadoPeriodo("maxparciales");
                        iconerror.classList.add("is-invalid");
                        input.classList.add("entrada-error");
                        return evaluarEstadoFormulario(idbtn);
                    }
                }
            } else {
                // Validación original para agregar nuevo parcial
                if (verificarMaxParciales() >= 4) {
                    periodoInfo.textContent =
                        "Error: No se permite más de 4 parciales por periodo.";
                    setEstadoPeriodo("maxparciales");
                    iconerror.classList.add("is-invalid");
                    input.classList.add("entrada-error");
                    return evaluarEstadoFormulario(idbtn);
                }
            }
            
            // Mostrar estado del periodo seleccionado
            if (estado === "pendiente") {
                periodoInfo.textContent = "Periodo pendiente";
                setEstadoPeriodo("pendiente");
                return evaluarEstadoFormulario(idbtn);
            }
            if (estado === "abierto" || estado === "activo") {
                periodoInfo.textContent = "Periodo abierto";
                setEstadoPeriodo("abierto");
                return evaluarEstadoFormulario(idbtn);
            }

            break;
    }
    // Siempre reevalúa el estado global al final
    evaluarEstadoFormulario(idbtn);
}

function evaluarEstadoFormulario(idbtn) {
    const nombreInput = document.getElementById("nombre_parcial");
    const periodoInput = document.getElementById("periodo_Id");
    const btnGuardar = document.getElementById(idbtn);

    // Verificar si hay errores en los campos
    const hayErrores = [
        nombreInput.classList.contains("entrada-error"),
        periodoInput.classList.contains("entrada-error"),
    ].some(Boolean);

    camposVacios = [
        nombreInput.value.trim() === "",
        periodoInput.value.trim() === "",
    ].some(Boolean);
    // Habilitar o deshabilitar el botón de guardar
    btnGuardar.disabled = hayErrores || camposVacios;
}

function setEstadoPeriodo(estado) {
    const div = document.getElementById("periodoInfoclass");

    // Quita las clases de Bootstrap que no correspondan
    div.classList.remove(
        "alert-success",
        "alert-info",
        "alert-warning",
        "alert-danger"
    );

    switch (estado) {
        case "abierto":
        case "activo":
            div.classList.add("alert-success");
            break;
        case "pendiente":
            div.classList.add("alert-warning");
            break;
        case "maxparciales":
        case "error":
            div.classList.add("alert-danger");
            break;
        default:
            div.classList.add("alert-info");
            break;
    }
}

//funcion para mostrar el error de escritura
function mostrarErrorparcial(input, mensaje) {
    const contenedorCampo = input.closest(".mb-4");
    // Eliminamos mensaje anterior si ya existe
    const errorPrevio = contenedorCampo.querySelector(".errorscaracter");
    if (errorPrevio) errorPrevio.remove();
    const alerta = document.createElement("p");
    alerta.textContent = mensaje;
    alerta.classList.add("errorscaracter");
    contenedorCampo.appendChild(alerta); // Insertamos debajo del input group
}
// Función para verificar el máximo de parciales permitidos
function verificarMaxParciales() {
    let maxParciales = 3; // Definir el máximo permitido
    return maxParciales;
}

// Función para verificar el conteo de parciales en un periodo específico
function verificarParcialesEnPeriodo(periodoId) {
    // Esta función debería hacer una consulta real al servidor
    // Por ahora simulo el conteo
    const conteosPorPeriodo = {
        "1": 2, // Periodo 1 tiene 2 parciales
        "2": 1, // Periodo 2 tiene 1 parcial
        "3": 4  // Periodo 3 tiene 4 parciales (máximo)
    };
    
    return conteosPorPeriodo[periodoId] || 0;
}

// Función para validar si un parcial puede ser editado según su estado
function validarEstadoParcialParaEdicion(estadoParcial) {
    const estadosNoEditables = ["cerrado", "cancelado"];
    return !estadosNoEditables.includes(estadoParcial.toLowerCase());
}

// Función para cargar datos del parcial en el formulario de modificación
function cargarDatosParcial(idParcial) {
    // Esta función debería hacer una petición AJAX para obtener los datos del parcial
    // Por ahora simulo los datos para demostrar la funcionalidad
    
    // Simular datos del parcial (en implementación real vendría del servidor)
    const datosParcial = {
        id: idParcial,
        nombre: "Primer Parcial",
        periodo_id: "2",
        periodo_nombre: "Periodo 2",
        estado: "pendiente" // Estados posibles: pendiente, activo, cerrado, cancelado
    };
    
    // Verificar si el parcial puede ser editado
    if (!validarEstadoParcialParaEdicion(datosParcial.estado)) {
        mostrarErrorCaptura("No se puede modificar un parcial en estado " + datosParcial.estado);
        // Deshabilitar todos los campos editables
        document.getElementById("nombre_parcial").disabled = true;
        document.getElementById("periodo_Id").disabled = true;
        document.getElementById("btnModificarJ").disabled = true;
        return false;
    }
    
    // Cargar los datos en el formulario
    document.getElementById("id_parcial").value = datosParcial.id;
    document.getElementById("nombre_parcial").value = datosParcial.nombre;
    document.getElementById("periodo_Id").value = datosParcial.periodo_id;
    document.getElementById("idperiodo").value = datosParcial.periodo_id;
    document.getElementById("estado_parcial").value = datosParcial.estado;
    
    // Actualizar la información del periodo
    const periodoSelect = document.getElementById("periodo_Id");
    const opcionSeleccionada = periodoSelect.options[periodoSelect.selectedIndex];
    if (opcionSeleccionada) {
        const estadoPeriodo = opcionSeleccionada.dataset.estado;
        document.getElementById("periodoInfo").textContent = `Periodo ${datosParcial.periodo_nombre}`;
        setEstadoPeriodo(estadoPeriodo);
    }
    
    // Evaluar el estado inicial del formulario
    evaluarEstadoFormulario("btnModificarJ");
    
    return true;
}

// Función específica para validar periodos en modificación (solo pendiente y activo)
function validarPeriodoParaModificacion(estadoPeriodo) {
    const estadosPermitidos = ["pendiente", "activo", "abierto"];
    return estadosPermitidos.includes(estadoPeriodo.toLowerCase());
}

// Función para validar el formulario de modificación específicamente
function validarFormularioModificacion() {
    const nombre_parcial = document.querySelector("#nombre_parcial");
    const periodo_Id = document.querySelector("#periodo_Id");
    const estado_parcial = document.querySelector("#estado_parcial");
    
    const nombre = nombre_parcial.value.trim();
    const periodo = periodo_Id.value.trim();
    const estadoParcial = estado_parcial.value.trim();
    
    // Verificar que el parcial puede ser modificado
    if (!validarEstadoParcialParaEdicion(estadoParcial)) {
        mostrarErrorCaptura("No se puede modificar un parcial en estado " + estadoParcial);
        return false;
    }
    
    // Validar campos vacíos
    if (!nombre || !periodo) {
        mostrarErrorCaptura("No se pueden dejar campos vacíos. Verifique e intente de nuevo.");
        return false;
    }
    
    // Validar que el periodo seleccionado sea válido para modificación
    const periodoSelect = document.getElementById("periodo_Id");
    const opcionSeleccionada = periodoSelect.options[periodoSelect.selectedIndex];
    if (opcionSeleccionada) {
        const estadoPeriodo = opcionSeleccionada.dataset.estado;
        if (!validarPeriodoParaModificacion(estadoPeriodo)) {
            mostrarErrorCaptura("Solo se pueden seleccionar periodos en estado 'Pendiente' o 'Activo'");
            return false;
        }
    }
    
    // Validar límite de parciales si se cambia de periodo
    const periodoOriginal = document.getElementById("idperiodo").dataset.original || "";
    if (periodo !== periodoOriginal) {
        const conteoActual = verificarParcialesEnPeriodo(periodo);
        if (conteoActual >= 4) {
            mostrarErrorCaptura("El periodo seleccionado ya tiene el máximo de 4 parciales permitidos");
            return false;
        }
    }
    
    return true;
}
