//Autor Miguel Angel
//descripcion de funcionamiento
/*
Aqui se cargan los formularios de agregar y modificar, ademas se generan las validacions correspondientes
como validar campos vacion, que esten escritos correctamente y que sean igual que las validaciones se piden
tambien se inyecta codigo html y clases de css desde este archivo.
Calquier duda consultar con el autor
*/

// Esta funcion que permite cargar los formularios de agregar Docente y modificarlo, no desde function.js
/*function loadFormJCarrera(opc, id = "") {
    let url = "";
    if (opc === "fmrcarrera") {
        url = "carrera/frmCarrera.php";
    } else if (opc === "modCarrera") {
        url = "carrera/modCarrera";
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
                            if (opc === "modDocente" && id !== "") {
                                BuscarDocente(id);
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
}*/

//Funcion que permite evaluar los campos antes de aguardar a un docente
function validarcamposCarrera(opc) {
    //se obtienen los campos a evaluar
    let clavecarrerae = document.getElementById('clavecarrera');
    let nombreEntrada = document.getElementById('nombrecarrera');
    let clavejefee = document.getElementById('clavejefe');
    let regex =  /^[A-Z]{4}-\d{4}-\d{3}$/; //aqui espesificamos que como de ver el formato de la claveCarrera
    let regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    let regexj =  /^[A-Za-z]{3}-\d{4}$/;//aqui espesificamos que como de ver el formato de la clave de Jefe de carrera


    //otenemos los valores limpios de las entradas
    let nombrecarrera = nombreEntrada.value.trim();
    let clavecarrera = clavecarrerae.value.trim();
    let claveJefe = clavejefee.value.trim();

    switch (opc) {


        case 'guardar':


            if (clavecarrera === '' || nombrecarrera === '' || claveJefe === '') {
                // Verificar cada campo y aplicar la clase si está vacío
                marcarErrorCarrera(clavecarrerae, clavecarreraa);
                marcarErrorCarrera(nombreEntrada, nombredocente);
                marcarErrorCarrera(clavejefee, );
                //Mostrar modal de error de captura de datos
                mostrarErrorCaptura('No se pueden dejar campos vacios. Verifique e intente de nuevo');
                deshabilitarbtnCarrera(true, "btnGuardarJ");
            }

            //validamos que la clave de docente y de ejefe de carrera sea escrita correctamente
            else if (!regex.test(clavecarrera) || !regexj.test(claveJefe)) {
                mostrarErrorCaptura('Formato de Clave invalido.');
                mostrarErrorCaptura(
                    "Clave Invalida, Verifique");
               
                deshabilitarbtnCarrera(true, "btnGuardarJ");
            }

            //validamos que el nombre solo sontenga letras y espacios
            else if (!regexNombre.test(nombrecarrera)) {
                mostrarErrorCaptura(
                    "Nombre inválido. Solo se permiten letras y espacios");
                nombreEntrada.classList.add("entrada-error");
                nombreEntrada.focus();
                deshabilitarbtnCarrera(true, "btnGuardarJ");


            } else {
                /*Si todo esta bien podemos almacenar los datos
                se desactiva el btn guardar, hasta que se realize un cambio este podra volver a guardar*/
                deshabilitarbtnDocente(true, "btnGuardarJ");
                intentarGuardarDatosCarrera()

            }
            break;

        //validaciones para el formulario de modificar


    }
}

    //Funcion para guardar los datos de los frm
function intentarGuardarDatosCarrera() {
    try {
        // si todo esta bien se manda a llamar ala funcion que guarda los datos y se muestra el modal de datos aguardados correctamente 
        console.log('funciona')
        mostrarDatosGuardados('Exelente xd')


    } catch (error) {
        // en caso de una falla se deabilita el boton y se muestra el modal con el problema
        ErrorDeIntentoDeGuardado('Error al intentar Guardar los datos');
        deshabilitarbtnCarrera(true, "btnGuardarJ");
    }
}

// Función para marcar error en un campo vacío
function marcarErrorCarrera(input, valor) {
    if (valor === '') {
        input.classList.add("entrada-error");

    } else {
        input.classList.remove("entrada-error");
    }
}

// funcion que permite evaluar los campos que esten correctamente mientras el usuario escribe
function verificarInputcarrera(idetiqueta, idbtn) {
    let input = document.getElementById(idetiqueta);
    const valor = input.value.trim();
    const estaVacio = valor === "";
    const iconerror = document.querySelector(`#${idetiqueta}`);
    const contenedor = input.closest('.mb-4');
    const errorPrevio = contenedor.querySelector('.errorscaracter');

    if (errorPrevio) {
        errorPrevio.remove();
        input.classList.remove("entrada-error");
        iconerror.classList.remove('is-invalid');
    }

    // Validaciones por tipo de campo
    switch (idetiqueta) {
        case "clavecarrera":
            const regexClavec = /^[A-Z]{4}-\d{4}-\d{3}$/;

            if (estaVacio) {
                mostrarErrorCarrera(input, 'Este campo no puede estar vacío.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
                return evaluarEstadoFormulariocarrera(idbtn);
            }
            if (!regexClavec.test(valor)) {
                mostrarErrorCarrera(input, 'Solo se permite cuatro letras mayusculas al inicio, un guión -, 4 dijitos y 3 dijitos al final. Ejem. IINF-2010-220');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
                return evaluarEstadoFormulariocarrera(idbtn);
            }
            if (regexClavec.test(valor)) {
                //funcion que permite evualuar si ya existe la clave
                //se cambia  nombredefuncio por la funcion que hara la comprobacion si clave existe, simplemente elimina /**/ y listo para usarse
                /* nombredefuncion(valor, function(existe) {
                     if (existe) {
                         claveExistenteCarrera(iconerror, input); 
                     } else {
                         console.log('La clave no existe y se puede usar.');
                     }
                     evaluarEstadoFormulariocarrera(idbtn); 
                 });*/
            }
            break;

        case "nombrecarrera":
            const soloLetras = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/;
            if (estaVacio) {
                mostrarErrorCarrera(input, 'Este campo no puede estar vacío.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
                return evaluarEstadoFormulariocarrera(idbtn);
            }
            if (!soloLetras.test(valor)) {
                mostrarErrorDocente(input, 'No se permiten caracteres especiales. Solo letras y espacios.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
                return evaluarEstadoFormulariocarrera(idbtn);
            }
            break;

        case "clavejefe":
            const regexClave = /^[A-Z]{3}-\d{4}$/;
            if (estaVacio) {
                mostrarErrorCarrera(input, 'Este campo no puede estar vacío.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
                return evaluarEstadoFormulariocarrera(idbtn);
            }
            if (!regexClave.test(valor)) {
                mostrarErrorCarrera(input, 'Solo se permite tres letras mayusculas al inicio, un guión medio - y 4 numeros. Ejem. TEA-0001');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
                return evaluarEstadoFormulariocarrera(idbtn);
            }
            break;
    }
    evaluarEstadoFormulariocarrera(idbtn);
}
// funcion que permite evaluar campos que todo se este cumpliendo adecuadamente.
// manda a llamar la funcion para habilitar o desabilitar el boton de acuerdo si todo esta bien
function evaluarEstadoFormulariocarrera(idbtn) {
    const clave = document.getElementById('clavecarrera');
    const nombre = document.getElementById('nombrecarrera');
    const clavej = document.getElementById('clavejefe');
    const errores = document.querySelectorAll('.errorscaracter');

    const camposLlenos =
        clave.value.trim() !== '' &&
        nombre.value.trim() !== '' &&
        clavej.value.trim() !== '';

    const claveValida = /^[A-Z]{4}-\d{4}-\d{3}$/.test(clave.value.trim());
    const nombreValido = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/.test(nombre.value.trim());
    const clavejefe = /^[A-Z]{3}-\d{4}$/.test(clavej.value.trim());

    const todoBien = errores.length === 0 && camposLlenos && claveValida && nombreValido && clavejefe;

    deshabilitarbtnCarrera(!todoBien, idbtn); // true = deshabilita, false = habilita

}
//funcion para mostrar el error de escritura
function mostrarErrorCarrera(input, mensaje) {

    const contenedorCampo = input.closest('.mb-4');

    // Sequita el error si ya existia antes
    const errorPrevio = contenedorCampo.querySelector('.errorscaracter');
    if (errorPrevio) errorPrevio.remove();
    const alerta = document.createElement('p');
    alerta.textContent = mensaje;
    alerta.classList.add('errorscaracter');
    contenedorCampo.appendChild(alerta); // Insertamos debajo del input group y dentro del contenedorcampo
    
    /* por si quieren despues de 5 seg desarapecer el parrafo
    setTimeout(() => {
        alerta.remove();
    }, 5000);*/
}
    //funcion que iyecta clases de css para inidcar que algo estara mal
function claveExistenteCarrera(iconerror, input) {
    mostrarErrorCarrera(input, 'La clave ya existe intente con otra.');
    iconerror.classList.add('is-invalid');
    input.classList.add("entrada-error");
}

//funcion para habilitar o desabilitar cualquier boton
function deshabilitarbtnCarrera(estado, botonId) {
    let boton = document.getElementById(botonId);
    if (boton) {
        boton.disabled = estado; // Deshabilita si estado es true, habilita si es false
    } else {
        console.error("Botón no encontrado con ID:", botonId);
    }
}


// funcion para inyectar opciones a select
//espero esto sea de ayuda xd
// para ejecutar la funcion ir a function.js y quitar // para ejecutar esta funcion
function cargarNombresEnSelect() {
    $.ajax({
        url: "../../Controlador/Intermediarios/........", //ponen la url correcta para cargar los nombres de los jefes de carrera
        type: "GET", // no se si usan get o post ustedes lo cambian
        dataType: "json",
        success: function (respuesta) {
            const select = $("#listaNombres");
            select.empty(); // con esto limpiamos las opciones si ya avia
            select.append('<option value="">Seleccione un nombre</option>'); 

            respuesta.forEach(function(nombre) {
                select.append(`<option value="${nombre}">${nombre}</option>`);
            });
        },
        error: function () {
            mostrarErrorCaptura("Error al cargar los nombres.")
            console.error("Error al cargar los nombres.");
        }
    });
}
