function loadFormAlumno(opc, id = "") {
    let url = "";
    if (opc === "frmalumno") {
        url = "alumno/frmAlumno.php";
    } else if (opc === "modalumno") {
        url = "alumno/modAlumno.php";
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
                            // Si es edición, llamar a buscarDocente automáticamente

                            if (opc === "modalumno" && id !== "") {
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

// Función principal de validación para formulario de alumno
function verificarInputAlumno(idetiqueta, idbtn) {
    let input = document.getElementById(idetiqueta);
    const valor = input.value.trim();
    const estaVacio = valor === "";
    const iconerror = document.querySelector(`#${idetiqueta}`);

    // Expresiones regulares para validaciones específicas
    const regexNoControl = /^[Cc]?[0-9]{8,10}$/; // Puede iniciar con C/c, seguido de 7-8 números
    const soloLetras = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/; // Solo letras y espacios
    const soloNumeros = /^[0-9]+$/; // Solo números

    const contenedor = input.closest('.mb-3');
    let errorPrevio = contenedor.querySelector('.errorscaracter');

    // Limpiar errores anteriores
    if (errorPrevio) {
        errorPrevio.remove();
        input.classList.remove("entrada-error");
        iconerror.classList.remove('is-invalid');
    }

    // Validaciones específicas por campo
    switch (idetiqueta) {
        case "noControl":
            if (estaVacio) {
                mostrarError(input, 'El número de control no puede estar vacío.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
            } else if (!regexNoControl.test(valor)) {
                mostrarError(input, 'Formato incorrecto. Debe tener 8 caracteres máximo, puede iniciar con "C". Ej: C1234567');
                iconerror.classList.add('is-invalid');
                input.classList.add("entrada-error");
            } else {
                // Verificar si el número de control ya existe
                verificarNoControlAlumno(valor, function (existe) {
                    if (existe) {
                        claveExistenteAlumno(iconerror, input);
                    } else {
                        console.log('El número de control está disponible.');
                    }
                    evaluarFormularioAlumno(idbtn);
                });
                return; // Salir aquí para evitar la evaluación duplicada
            }
            break;

        case "nombreAlumno":
            if (estaVacio) {
                mostrarError(input, 'El nombre no puede estar vacío.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
            } else if (!soloLetras.test(valor)) {
                mostrarError(input, 'No se permiten números ni caracteres especiales. Solo letras y espacios.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
            }
            break;

        case "grado":
            const gradoNum = parseInt(valor);
            if (estaVacio) {
                mostrarError(input, 'El grado no puede estar vacío.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
            } else if (!soloNumeros.test(valor) || gradoNum < 1 || gradoNum > 12) {
                mostrarError(input, 'El grado debe ser un número entre 1 y 12.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
            }
            break;

        case "periodosEnBaja":
            const periodosNum = parseInt(valor);
            if (valor !== "" && (!soloNumeros.test(valor) || periodosNum < 0 || periodosNum > 3)) {
                mostrarError(input, 'Los períodos en baja deben ser un número entre 0 y 3.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
            }
            break;

        default:
            // Para otros campos de texto
            if (estaVacio) {
                mostrarError(input, 'Este campo no puede estar vacío.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
            }
            break;
    }

    evaluarFormularioAlumno(idbtn);
}

// Función para validar selects (grupo, género, turno)
function verificarSelectAlumno(idetiqueta, idbtn) {
    let select = document.getElementById(idetiqueta);
    const valor = select.value;
    const estaVacio = valor === "" || valor === null;

    const contenedor = select.closest('.mb-3');
    let errorPrevio = contenedor.querySelector('.errorscaracter');

    // Limpiar errores anteriores
    if (errorPrevio) {
        errorPrevio.remove();
        select.classList.remove("entrada-error");
        select.classList.remove('is-invalid');
    }

    // Validar si es campo obligatorio
    const camposObligatorios = ['grupo', 'genero', 'turno'];

    if (camposObligatorios.includes(idetiqueta) && estaVacio) {
        mostrarError(select, 'Este campo es obligatorio.');
        select.classList.add("entrada-error");
        select.classList.add('is-invalid');
    }

    evaluarFormularioAlumno(idbtn);
}

// Función para evaluar todo el formulario
function evaluarFormularioAlumno(idbtn) {
    const btnGuardar = document.getElementById(idbtn);

    // Campos obligatorios
    const camposObligatorios = [
        'noControl',
        'nombreAlumno',
        'grado',
        'grupo',
        'genero',
        'turno'
    ];

    let formularioValido = true;

    // Verificar cada campo obligatorio
    camposObligatorios.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (!elemento) return;

        const valor = elemento.value.trim();
        const tieneError = elemento.classList.contains('entrada-error') ||
            elemento.classList.contains('is-invalid');

        if (valor === "" || tieneError) {
            formularioValido = false;
        }
    });

    // Verificar que se haya seleccionado una carrera
    const carrera = document.getElementById('listaCarrera');
    if (!carrera || carrera.value === "") {
        formularioValido = false;
    }

    // Habilitar/deshabilitar botón
    btnGuardar.disabled = !formularioValido;
}

// Funciones auxiliares (deben implementarse)
function verificarNoControlAlumno(noControl, callback) {
    // AJAX para verificar si el número de control ya existe
    $.post("alumno/verificarNoControl.php",
        JSON.stringify({noControl: noControl}),
        function (response) {
            const resultado = JSON.parse(response);
            callback(resultado.existe);
        }
    ).fail(function () {
        console.error('Error al verificar número de control');
        callback(false);
    });
}

function claveExistenteAlumno(iconerror, input) {
    mostrarError(input, 'Este número de control ya está registrado.');
    input.classList.add("entrada-error");
    iconerror.classList.add('is-invalid');
}

function mostrarError(elemento, mensaje) {
    const contenedor = elemento.closest('.mb-3');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'errorscaracter text-danger mt-1';
    errorDiv.textContent = mensaje;
    contenedor.appendChild(errorDiv);
}

// Función principal para guardar nuevo alumno
function guardarNuevoAlumno() {
    // Obtener y limpiar los valores de los campos del formulario
    const noControl = document.getElementById("noControl").value.trim();
    const nombreAlumno = document.getElementById("nombreAlumno").value.trim();
    const grado = document.getElementById("grado").value.trim();
    const grupo = document.getElementById("grupo").value.trim();
    const genero = document.getElementById("genero").value.trim();
    const turno = document.getElementById("turno").value.trim();
    const periodosEnBaja = document.getElementById("periodosEnBaja").value.trim() || "0";
    const listaCarrera = document.getElementById("listaCarrera").value.trim();
    const claveCarrera = document.getElementById("claveCarrera").value.trim();
    const estado = "Activo"; // Valor fijo

    // Validación: asegurar que todos los campos obligatorios estén completos
    if (!noControl || !nombreAlumno || !grado || !grupo || !genero || !turno || !listaCarrera) {
        mostrarFaltaDatos("Por favor, llena todos los campos obligatorios.");
        return false;
    }

    // Construcción del objeto de datos a enviar
    const datos = {
        noControl: noControl,
        nombreAlumno: nombreAlumno,
        grado: parseInt(grado),
        grupo: grupo,
        genero: genero,
        turno: turno,
        periodosEnBaja: parseInt(periodosEnBaja),
        idCarrera: listaCarrera,
        claveCarrera: claveCarrera,
        estado: estado
    };

    // Convertir el objeto a JSON para el envío
    const json = JSON.stringify(datos);
    const url = "../../Controlador/Intermediarios/Alumno/AgregarAlumno.php";

    // Envío AJAX al servidor
    $.ajax({
        url: url,
        type: "POST",
        data: json,
        contentType: "application/json",
        dataType: "json",
        // Manejo de la respuesta exitosa
        success: function (respuesta) {
            try {
                console.log("Respuesta:", respuesta);
                if (!respuesta) throw new Error("Respuesta vacía");

                if (respuesta.estado === "OK") {
                    // Mostrar modal de éxito y recargar formulario
                    mostrarDatosGuardados(respuesta.mensaje, function () {
                        option("student", "");
                    });
                } else if (
                    respuesta.estado === "ERROR" &&
                    respuesta.mensaje &&
                    respuesta.mensaje
                        .toLowerCase()
                        .includes("número de control ya existe")
                ) {
                    // Número de control duplicado: mensaje específico
                    mostrarErrorCaptura(
                        "El número de control ya existe. Por favor, usa otro."
                    );
                } else {
                    // Otro error del servidor
                    mostrarErrorCaptura(
                        respuesta.mensaje || "Error desconocido al guardar."
                    );
                }
            } catch (error) {
                console.error("Fallo en el success:", error);
                mostrarErrorCaptura("Error inesperado procesando la respuesta.");
            }
        },
        // Manejo de errores de red o del servidor
        error: function (xhr, status, error) {
            console.error("AJAX Error:", status, error);
            mostrarErrorCaptura(`Error de conexión: ${status} - ${error}`);
        },
    });

    return true;
}

// Función que permite evaluar los campos antes de guardar un alumno
function validarCamposAlumno(mensaje, opc) {
    // Se obtienen los campos a evaluar
    let noControlElement = document.getElementById("noControl");
    let nombreElement = document.getElementById("nombreAlumno");
    let gradoElement = document.getElementById("grado");
    let grupoElement = document.getElementById("grupo");
    let generoElement = document.getElementById("genero");
    let turnoElement = document.getElementById("turno");
    let periodosElement = document.getElementById("periodosEnBaja");
    let carreraElement = document.getElementById("listaCarrera");

    // Expresiones regulares para validación
    let regexNoControl = /^[Cc]?[0-9]{8,10}$/; // Puede iniciar con C/c, seguido de 7-8-10 números
    let regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Solo letras y espacios
    let regexGrado = /^[1-9]$|^1[0-2]$/; // Números del 1 al 12
    let regexPeriodos = /^[0-3]$/; // Números del 0 al 3

    // Obtener los valores limpios de las entradas
    let noControl = noControlElement.value.trim();
    let nombreAlumno = nombreElement.value.trim();
    let grado = gradoElement.value.trim();
    let grupo = grupoElement.value.trim();
    let genero = generoElement.value.trim();
    let turno = turnoElement.value.trim();
    let periodosEnBaja = periodosElement.value.trim();
    let carrera = carreraElement.value.trim();

    switch (opc) {
        case "guardar":
            // Verificar campos vacíos
            if (noControl === "" || nombreAlumno === "" || grado === "" ||
                grupo === "" || genero === "" || turno === "" || carrera === "") {

                // Marcar errores en campos vacíos
                marcarErrorAlumno(noControlElement, noControl);
                marcarErrorAlumno(nombreElement, nombreAlumno);
                marcarErrorAlumno(gradoElement, grado);
                marcarErrorAlumno(grupoElement, grupo);
                marcarErrorAlumno(generoElement, genero);
                marcarErrorAlumno(turnoElement, turno);
                marcarErrorAlumno(carreraElement, carrera);

                // Mostrar modal de error de captura de datos
                mostrarErrorCaptura(mensaje || "No se pueden dejar campos vacíos. Verifique e intente de nuevo");
                deshabilitarBtnAlumno(true, "btnGuardar");
                return;
            }

            // Validar formatos específicos
            if (!regexNoControl.test(noControl)) {
                mostrarErrorCaptura("Número de control inválido. Formato correcto: C1234567 (8 caracteres máximo)");
                noControlElement.classList.add("entrada-error");
                noControlElement.focus();
                deshabilitarBtnAlumno(true, "btnGuardar");
                return;
            }

            if (!regexNombre.test(nombreAlumno)) {
                mostrarErrorCaptura("Nombre inválido. Solo se permiten letras y espacios");
                nombreElement.classList.add("entrada-error");
                nombreElement.focus();
                deshabilitarBtnAlumno(true, "btnGuardar");
                return;
            }

            if (!regexGrado.test(grado)) {
                mostrarErrorCaptura("Grado inválido. Debe ser un número entre 1 y 12");
                gradoElement.classList.add("entrada-error");
                gradoElement.focus();
                deshabilitarBtnAlumno(true, "btnGuardar");
                return;
            }

            if (periodosEnBaja !== "" && !regexPeriodos.test(periodosEnBaja)) {
                mostrarErrorCaptura("Períodos en baja inválido. Debe ser un número entre 0 y 3");
                periodosElement.classList.add("entrada-error");
                periodosElement.focus();
                deshabilitarBtnAlumno(true, "btnGuardar");
                return;
            }

            // Si todo está bien, proceder a guardar
            deshabilitarBtnAlumno(true, "btnGuardar");
            intentarGuardarDatosAlumno("add");
            break;

        case "modificar":
            // Validaciones para el formulario de modificar
            if (noControl === "" || nombreAlumno === "" || grado === "" ||
                grupo === "" || genero === "" || turno === "" || carrera === "") {

                // Marcar errores en campos vacíos
                marcarErrorAlumno(noControlElement, noControl);
                marcarErrorAlumno(nombreElement, nombreAlumno);
                marcarErrorAlumno(gradoElement, grado);
                marcarErrorAlumno(grupoElement, grupo);
                marcarErrorAlumno(generoElement, genero);
                marcarErrorAlumno(turnoElement, turno);
                marcarErrorAlumno(carreraElement, carrera);

                mostrarErrorCaptura(mensaje || "No se pueden dejar campos vacíos. Verifique e intente de nuevo");
                deshabilitarBtnAlumno(true, "btnGuardar");
                return;
            }

            if (!regexNombre.test(nombreAlumno)) {
                mostrarErrorCaptura("Nombre inválido. Solo se permiten letras y espacios.");
                nombreElement.classList.add("entrada-error");
                nombreElement.focus();
                deshabilitarBtnAlumno(true, "btnGuardar");
                return;
            }

            // Validaciones adicionales para modificar...
            if (!regexGrado.test(grado)) {
                mostrarErrorCaptura("Grado inválido. Debe ser un número entre 1 y 12");
                gradoElement.classList.add("entrada-error");
                gradoElement.focus();
                deshabilitarBtnAlumno(true, "btnGuardar");
                return;
            }

            // Si todo está bien, proceder a modificar
            intentarGuardarDatosAlumno("mod");
            deshabilitarBtnAlumno(true, "btnGuardar");
            break;
    }
}

// Función principal para guardar nuevo alumno
function modificarAlumno() {
    // Obtener y limpiar los valores de los campos del formulario
    const noControl = document.getElementById("noControl").value.trim();
    const nombreAlumno = document.getElementById("nombreAlumno").value.trim();
    const grado = document.getElementById("grado").value.trim();
    const grupo = document.getElementById("grupo").value.trim();
    const genero = document.getElementById("genero").value.trim();
    const turno = document.getElementById("turno").value.trim();
    const periodosEnBaja = document.getElementById("periodosEnBaja").value.trim() || "0";
    const listaCarrera = document.getElementById("listaCarrera").value.trim();
    const claveCarrera = document.getElementById("claveCarrera").value.trim();
    const estado = "Activo"; // Valor fijo

    // Validación: asegurar que todos los campos obligatorios estén completos
    if (!noControl || !nombreAlumno || !grado || !grupo || !genero || !turno || !listaCarrera) {
        mostrarFaltaDatos("Por favor, llena todos los campos obligatorios.");
        return false;
    }

    // Construcción del objeto de datos a enviar
    const datos = {
        noControl: noControl,
        nombreAlumno: nombreAlumno,
        grado: parseInt(grado),
        grupo: grupo,
        genero: genero,
        turno: turno,
        periodosEnBaja: parseInt(periodosEnBaja),
        idCarrera: listaCarrera,
        claveCarrera: claveCarrera,
        estado: estado
    };

    // Convertir el objeto a JSON para el envío
    const json = JSON.stringify(datos);
    const url = "../../Controlador/Intermediarios/Alumno/AgregarAlumno.php";

    // Envío AJAX al servidor
    $.ajax({
        url: url,
        type: "POST",
        data: json,
        contentType: "application/json",
        dataType: "json",
        // Manejo de la respuesta exitosa
        success: function (respuesta) {
            try {
                console.log("Respuesta:", respuesta);
                if (!respuesta) throw new Error("Respuesta vacía");

                if (respuesta.estado === "OK") {
                    // Mostrar modal de éxito y recargar formulario
                    mostrarDatosGuardados(respuesta.mensaje, function () {
                        option("student", "");
                    });
                } else if (
                    respuesta.estado === "ERROR" &&
                    respuesta.mensaje &&
                    respuesta.mensaje
                        .toLowerCase()
                        .includes("número de control ya existe")
                ) {
                    // Número de control duplicado: mensaje específico
                    mostrarErrorCaptura(
                        "El número de control ya existe. Por favor, usa otro."
                    );
                } else {
                    // Otro error del servidor
                    mostrarErrorCaptura(
                        respuesta.mensaje || "Error desconocido al guardar."
                    );
                }
            } catch (error) {
                console.error("Fallo en el success:", error);
                mostrarErrorCaptura("Error inesperado procesando la respuesta.");
            }
        },
        // Manejo de errores de red o del servidor
        error: function (xhr, status, error) {
            console.error("AJAX Error:", status, error);
            mostrarErrorCaptura(`Error de conexión: ${status} - ${error}`);
        },
    });

    return true;
}

// Función auxiliar para marcar errores en campos
function marcarErrorAlumno(elemento, valor) {
    if (valor === "" || valor === null) {
        elemento.classList.add("entrada-error");
        elemento.classList.add("is-invalid");
    } else {
        elemento.classList.remove("entrada-error");
        elemento.classList.remove("is-invalid");
    }
}

// Función auxiliar para habilitar/deshabilitar botón
function deshabilitarBtnAlumno(estado, idBoton) {
    const boton = document.getElementById(idBoton);
    if (boton) {
        boton.disabled = estado;
    }
}

// Función que intenta guardar los datos del alumno
function intentarGuardarDatosAlumno(operacion) {
    try {
        if (operacion === "add") {
            guardarNuevoAlumno();
        } else if (operacion === "mod") {
            modificarAlumno(); // Esta función se implementaría para modificaciones
        }
    } catch (error) {
        console.error("Error al intentar guardar:", error);
        mostrarErrorCaptura("Error inesperado al guardar los datos.");
        deshabilitarBtnAlumno(false, "btnGuardar"); // Reactivar botón en caso de error
    }
}
