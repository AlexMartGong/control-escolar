//Autor Miguel Angel Lara H.
//Autor
//descripcion de funcionamiento
/*
Aqui se cargan los formularios de agregar y modificar, ademas se generan las validacions correspondientes
como validar campos vacion, que esten escritos correctamente y que sean igual que las validaciones se piden
tambien se inyecta codigo html y clases de css desde este archivo.

*/

function loadFormParcial(opc, id = "") {
    let url = "";
    if (opc === "frmParcial") {
        url = "parcial/frmParcial.php";
    } else if (opc === "modParcial") {
        url = "parcial/modParcial.html";
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
            //logica para validar y  modificar el parcial
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

    if (errorPrevio) {
        errorPrevio.remove();
        input.classList.remove("entrada-error");
        iconerror.classList.remove("is-invalid");
    }

    // Validaciones por tipo de campo
    switch (idetiqueta) {
        case "nombre_parcial":
            const soloLetras = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]+$/;
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
            if (verificarMaxParciales() >= 4) {
                periodoInfo.textContent =
                    "Error: No se permite más de 4 parciales por periodo.";
                setEstadoPeriodo("maxparciales");
                iconerror.classList.add("is-invalid");
                input.classList.add("entrada-error");
                return evaluarEstadoFormulario(idbtn);
            } else {
                if (estado === "pendiente") {
                    periodoInfo.textContent = "Periodo pendiente";
                    setEstadoPeriodo("pendiente");
                    return evaluarEstadoFormulario(idbtn);
                }
                if (estado === "abierto") {
                    periodoInfo.textContent = "Periodo abierto";
                    setEstadoPeriodo("abierto");
                    return evaluarEstadoFormulario(idbtn);
                }
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
            div.classList.add("alert-success");

            break;
        case "pendiente":
            div.classList.add("alert-warning");

            break;
        case "maxparciales":
            div.classList.add("alert-danger");

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
