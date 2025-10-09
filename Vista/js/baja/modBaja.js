//Autor: Sistema de Gestión de Bajas
//Descripción: Validaciones y funciones para modificar bajas

// Datos de ejemplo simulados (en producción vendrían del backend)
const bajasEjemplo = {
    "1": {
        idBaja: "1",
        idAlumno: "20240101",
        nombreAlumno: "Juan Pérez García",
        tipoBaja: "Definitiva",
        fecha: "2025-03-15",
        estatus: "Aplicada",
        motivo: "Cambio de institución educativa por motivos personales",
        idPeriodo: "1"
    },
    "2": {
        idBaja: "2",
        idAlumno: "20240102",
        nombreAlumno: "María López Hernández",
        tipoBaja: "Temporal",
        fecha: "2025-02-10",
        estatus: "Aplicada",
        motivo: "Problemas de salud que requieren atención prolongada",
        idPeriodo: "2"
    },
    "3": {
        idBaja: "3",
        idAlumno: "20240103",
        nombreAlumno: "Carlos Ramírez Sánchez",
        tipoBaja: "Definitiva",
        fecha: "2025-01-20",
        estatus: "Aplicada",
        motivo: "Situación económica que impide continuar con los estudios",
        idPeriodo: "1"
    }
};

// Función para cargar los datos de la baja en el formulario
function cargarDatosBaja(idBaja) {
    try {
        // Simular obtención de datos (en producción sería una petición al servidor)
        const baja = bajasEjemplo[idBaja];

        if (!baja) {
            mostrarErrorCaptura("No se encontró la baja con el ID especificado.");
            return;
        }

        // Verificar que el estatus sea "Aplicada"
        if (baja.estatus !== "Aplicada") {
            mostrarErrorCaptura("Solo se pueden modificar bajas con estatus 'Aplicada'.");
            setTimeout(() => {
                clearArea('modbaja');
                option('baja', '');
            }, 2000);
            return;
        }

        // Cargar datos en campos de solo lectura
        document.getElementById("idBaja").value = baja.idBaja;
        document.getElementById("idAlumno").value = baja.idAlumno;
        document.getElementById("nombreAlumno").value = baja.nombreAlumno;
        document.getElementById("tipoBaja").value = baja.tipoBaja;
        document.getElementById("estatus").value = baja.estatus;

        // Cargar datos en campos editables
        document.getElementById("fecha").value = baja.fecha;
        document.getElementById("motivo").value = baja.motivo;
        document.getElementById("idPeriodo").value = baja.idPeriodo;

        console.log("Datos de baja cargados exitosamente para ID: " + idBaja);
    } catch (error) {
        console.error("Error al cargar datos de baja:", error);
        mostrarErrorCaptura("Error al cargar los datos de la baja.");
    }
}

// Función para verificar campos en tiempo real
function verificarInputBaja(idCampo, idBoton) {
    let campo = document.getElementById(idCampo);
    let valor = campo.value.trim();
    let todosValidos = true;

    // Validar el campo actual
    if (idCampo === "motivo") {
        // Regex para motivo: solo letras, números, espacios y puntuación básica
        let regexMotivo = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:()\-]+$/;

        if (valor === "") {
            marcarErrorBaja(campo, valor);
            todosValidos = false;
        } else if (!regexMotivo.test(valor)) {
            campo.classList.add("entrada-error");
            campo.classList.add("is-invalid");
            mostrarError(campo, "No se permiten caracteres especiales en el motivo.", "contenedorcampo");
            todosValidos = false;
        } else {
            campo.classList.remove("entrada-error");
            campo.classList.remove("is-invalid");
            limpiarMensajeError(campo);
        }
    } else if (idCampo === "fecha") {
        if (valor === "") {
            marcarErrorBaja(campo, valor);
            todosValidos = false;
        } else {
            campo.classList.remove("entrada-error");
            campo.classList.remove("is-invalid");
            limpiarMensajeError(campo);
        }
    }

    // Verificar todos los campos editables
    let fecha = document.getElementById("fecha").value.trim();
    let motivo = document.getElementById("motivo").value.trim();
    let periodo = document.getElementById("idPeriodo").value;

    if (fecha === "" || motivo === "" || periodo === "") {
        todosValidos = false;
    }

    // Habilitar o deshabilitar botón
    deshabilitarboton(!todosValidos, idBoton);
}

// Función para manejar el select con retraso
function retrasoSelectBaja(idCampo, idBoton) {
    setTimeout(() => {
        verificarInputBaja(idCampo, idBoton);
    }, 500);
}

// Función para marcar errores en campos
function marcarErrorBaja(input, valor) {
    if (valor === "") {
        input.classList.add("entrada-error");
        input.classList.add("is-invalid");
    } else {
        input.classList.remove("entrada-error");
        input.classList.remove("is-invalid");
    }
}

// Función para limpiar mensaje de error
function limpiarMensajeError(input) {
    const contenedorCampo = input.closest(".contenedorcampo");
    if (contenedorCampo) {
        const errorPrevio = contenedorCampo.querySelector(".errorscaracter");
        if (errorPrevio) errorPrevio.remove();
    }
}

// Función principal de validación antes de guardar
function validarCamposBaja(opc) {
    // Obtener campos
    let idBajaInput = document.getElementById("idBaja");
    let idAlumnoInput = document.getElementById("idAlumno");
    let fechaInput = document.getElementById("fecha");
    let motivoInput = document.getElementById("motivo");
    let periodoInput = document.getElementById("idPeriodo");
    let estatusInput = document.getElementById("estatus");

    // Obtener valores
    let idBaja = idBajaInput.value.trim();
    let idAlumno = idAlumnoInput.value.trim();
    let fecha = fechaInput.value.trim();
    let motivo = motivoInput.value.trim();
    let periodo = periodoInput.value;
    let estatus = estatusInput.value.trim();

    // Regex para validar motivo
    let regexMotivo = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:()\-]+$/;

    switch (opc) {
        case "modificar":
            // Verificar que el estatus sea "Aplicada"
            if (estatus !== "Aplicada") {
                mostrarErrorCaptura("Solo se pueden modificar bajas con estatus 'Aplicada'.");
                return;
            }

            // Verificar campos vacíos
            if (fecha === "" || motivo === "" || periodo === "") {
                marcarErrorBaja(fechaInput, fecha);
                marcarErrorBaja(motivoInput, motivo);
                marcarErrorBaja(periodoInput, periodo);
                mostrarErrorCaptura("No se pueden dejar campos vacíos. Verifique e intente de nuevo.");
                deshabilitarboton(true, "btnGuardarBaja");
                return;
            }

            // Validar formato del motivo
            if (!regexMotivo.test(motivo)) {
                mostrarErrorCaptura("El motivo contiene caracteres no válidos. Solo se permiten letras, números, espacios y puntuación básica.");
                motivoInput.classList.add("entrada-error");
                motivoInput.classList.add("is-invalid");
                motivoInput.focus();
                deshabilitarboton(true, "btnGuardarBaja");
                return;
            }

            // Validar que el motivo no esté vacío después de trim
            if (motivo.length < 10) {
                mostrarErrorCaptura("El motivo debe tener al menos 10 caracteres.");
                motivoInput.classList.add("entrada-error");
                motivoInput.focus();
                deshabilitarboton(true, "btnGuardarBaja");
                return;
            }

            // Validar que la fecha no sea futura
            let fechaSeleccionada = new Date(fecha);
            let fechaActual = new Date();
            fechaActual.setHours(0, 0, 0, 0);

            if (fechaSeleccionada > fechaActual) {
                mostrarErrorCaptura("La fecha de baja no puede ser posterior a la fecha actual.");
                fechaInput.classList.add("entrada-error");
                fechaInput.focus();
                deshabilitarboton(true, "btnGuardarBaja");
                return;
            }

            // Validar que no exista otra baja para el mismo alumno en el mismo periodo
            if (validarBajaDuplicada(idAlumno, periodo, idBaja)) {
                mostrarErrorCaptura("Ya existe una baja registrada para este alumno en el periodo seleccionado.");
                periodoInput.classList.add("entrada-error");
                periodoInput.focus();
                deshabilitarboton(true, "btnGuardarBaja");
                return;
            }

            // Si todo está correcto, proceder a guardar
            deshabilitarboton(true, "btnGuardarBaja");
            intentarGuardarDatosBaja("mod");
            break;
    }
}

// Función para validar si ya existe una baja para el alumno en el periodo
function validarBajaDuplicada(idAlumno, idPeriodo, idBajaActual) {
    // En producción, esto haría una consulta al servidor
    // Por ahora, simulamos la validación con datos de ejemplo

    for (let key in bajasEjemplo) {
        let baja = bajasEjemplo[key];
        // Si encuentra otra baja del mismo alumno en el mismo periodo (excluyendo la actual)
        if (baja.idAlumno === idAlumno && baja.idPeriodo === idPeriodo && baja.idBaja !== idBajaActual) {
            return true; // Ya existe
        }
    }
    return false; // No existe duplicado
}

// Función para intentar guardar los datos
function intentarGuardarDatosBaja(opc) {
    try {
        if (opc === "mod") {
            modificarBaja();
        }
    } catch (error) {
        console.error("Error al intentar guardar:", error);
        mostrarErrorCaptura("Error al procesar la solicitud.");
    }
}

// Función para modificar la baja (simulada)
function modificarBaja() {
    // Obtener datos del formulario
    let idBaja = document.getElementById("idBaja").value;
    let fecha = document.getElementById("fecha").value;
    let motivo = document.getElementById("motivo").value.trim();
    let idPeriodo = document.getElementById("idPeriodo").value;

    // Simular envío al servidor
    console.log("Modificando baja:", {
        idBaja: idBaja,
        fecha: fecha,
        motivo: motivo,
        idPeriodo: idPeriodo
    });

    mostrarDatosGuardados('Baja modificada exitosamente.', function () {
        option('baja', '');
    });

}

// Función para habilitar/deshabilitar botón (si no existe en funcionesGlobales.js)
if (typeof deshabilitarboton !== 'function') {
    function deshabilitarboton(estado, botonId) {
        let boton = document.getElementById(botonId);
        if (boton) {
            boton.disabled = estado;
        } else {
            console.error("Botón no encontrado con ID:", botonId);
        }
    }
}

// Función para mostrar errores (si no existe en funcionesGlobales.js)
if (typeof mostrarError !== 'function') {
    function mostrarError(input, mensaje, contenedor) {
        const contenedorCampo = input.closest(`.${contenedor}`);
        if (!contenedorCampo) return;

        const errorPrevio = contenedorCampo.querySelector(".errorscaracter");
        if (errorPrevio) errorPrevio.remove();

        const alerta = document.createElement("p");
        alerta.textContent = mensaje;
        alerta.classList.add("errorscaracter");
        alerta.style.color = "red";
        alerta.style.fontSize = "0.875rem";
        alerta.style.marginTop = "0.25rem";
        contenedorCampo.appendChild(alerta);
    }
}

