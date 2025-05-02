//Autor Miguel Angel
//Autor Alex Martinez Gonzalez
//descripcion de funcionamiento
/*
Aqui se cargan los formularios de agregar y modificar, ademas se generan las validacions correspondientes
como validar campos vacion, que esten escritos correctamente y que sean igual que las validaciones se piden
tambien se inyecta codigo html y clases de css desde este archivo.
Calquier duda consultar con el autor
*/

// Esta funcion que permite cargar los formularios de agregar Docente y modificarlo, no desde function.js
function loadFormJCarrera(opc, id = "") {
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

                           /* if (opc === "modDocente" && id !== "") {
                                BuscarDocente(id); me imagino que esto se remplaza ahora por el de carrera
                            }*/
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

//Funcion que permite evaluar los campos antes de aguardar a un docente
function validarcamposCarrera(opc) {
    //se obtienen los campos a evaluar
    let clavecarrerae = document.getElementById('clavecarrera');
    let nombreEntrada = document.getElementById('nombrecarrera');
    let clavejefee = document.getElementById('clavejefe');
    let regex = /^[A-Z]{4}-\d{4}-\d{3}$/; //aqui espesificamos que como de ver el formato de la claveCarrera
    let regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    let regexj = /^[A-Za-z]{3}-\d{4}$/;//aqui espesificamos que como de ver el formato de la clave de Jefe de carrera


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
                marcarErrorCarrera(clavejefee,);
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

//esta funcion solo es llamda cuando se seleciona una opcion en el <select> primero se agregan los datos y despues validan
function retrasoSelect(idetiqueta, idbtn){
    setTimeout (() => {
        verificarInputcarrera(idetiqueta, idbtn)
    }, 1000)
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


//funcion que ejecutara con un retraso predeterminado a las funciones
/*
cargarNombresEnSelect()
esto con el objetivo de que se carge primero el la inyeccion del html al DOM
y despues se ejecute el codigo y se inyecten las opciones al <select>
*/
function cargaRetrasadaDeDatos() {
    setTimeout(() => {
        //console.log("Ejecutado con retraso");
        simulacion() //este se borrara y sera remplazado por el de abajo o si solo quieres comentarlo back end y listo
       // cargarNombresEnSelect() este es el chido
    }, 500);
   
}

// funcion para inyectar opciones al select 
//espero esto sea de ayuda xd

function cargarNombresEnSelect() {
    $.ajax({
        url: "../../Controlador/Intermediarios/........", // coloca la URL correcta aquí :)
        type: "GET",
        dataType: "json",
        success: function (respuesta) {
            const select = $("#listaNombres");
            select.empty();
            select.append('<option value="">Seleccione un nombre</option>');

            // aqui agregamos las opc al select
            respuesta.forEach(function (jefe) {
                select.append(`<option value="${jefe.nombre}" data-clave="${jefe.clave}">${jefe.nombre}</option>`);
            });

            // bueno este evento es para cambiar clave cada ves que se selecciona una opc diferente
            select.off("change").on("change", function () {
                const clave = $(this).find("option:selected").data("clave") || "";
                $("#clavejefe").val(clave);
            });
        },
        error: function () {
            mostrarErrorCaptura("Error al cargar los nombres.");
            console.error("Error al cargar los nombres.");
        }
    });
}


//funcion para simualar la inyeccion de datos en select 
//esta funcion se borrara solo sirve para simular 
//me llevo un buen rato xd
function simulacion(){
const select = document.getElementById("listaNombres");
const inputClave = document.getElementById("clavejefe");


const opciones = [
  { nombre: "Sutano", clave: "TED-6935" },
  { nombre: "Fulano", clave: "TED-4821" },
  { nombre: "Mangano", clave: "TED-7740" }
];

// Agregar opciones al select
opciones.forEach(op => {
  const opcion = document.createElement("option");
  opcion.value = op.clave;
  opcion.textContent = op.nombre;
  select.appendChild(opcion);
});

// Escuchar el cambio de selección
select.addEventListener("change", function() {
  inputClave.value = this.value; // Coloca la clave seleccionada en el input
});
}



function changeStatusCarrera(id, status, currentStatus) {
    // Si no hay un estado seleccionado (opción por defecto) o el estado seleccionado es igual al actual, no hacer nada
    if (!status || status === "Cambiar estado" || status === currentStatus) {
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
                    <p class="text-center">¿Está seguro de cambiar el estado de la carrera <strong>${id}</strong> a <strong>${status}</strong>?</p>
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
            `select[onchange="changeStatusCarrera('${id}', this.value, '${currentStatus}')"]`
        );
        if (selectElement) {
            selectElement.value = currentStatus;
        }
    });

    // También resetear al cerrar el modal con la X o haciendo clic fuera
    modalElement.addEventListener("hidden.bs.modal", function () {
        const selectElement = document.querySelector(
            `select[onchange="changeStatusCarrera('${id}', this.value, '${currentStatus}')"]`
        );
        if (selectElement) {
            selectElement.value = currentStatus;
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
                id: id,
                status: status,
            };

            // Convertir a JSON
            let json = JSON.stringify(data);

            console.log(
                `Cambiando estado de carrera ${id} a ${status}`
            );

            // Realizar petición AJAX para cambiar el estado
            $.ajax({
                url: "../../Controlador/Intermediarios/Carrera/CambiarEstadoCarrera.php",
                type: "POST",
                data: json,
                contentType: "application/json",
                timeout: 10000, // 10 segundos de timeout
                success: function (response) {
                    try {
                        if (response.estado === "OK") {
                            mostrarDatosGuardados(
                                `El estado de la carrera ${id} ha sido cambiado a "${status}" correctamente.`,
                                function () {
                                    option("career", "");
                                }
                            );
                        } else {
                            mostrarErrorCaptura(
                                response.mensaje || "Error al cambiar el estado."
                            );
                        }
                    } catch (e) {
                        mostrarErrorCaptura("Error al procesar la respuesta: " + e.message);
                    }
                },
                error: function (xhr, status, error) {
                    mostrarErrorCaptura(
                        `Error al cambiar el estado: ${status} - ${error}`
                    );
                },
            });
        });
}