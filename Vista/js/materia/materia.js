//Autor Miguel Angel Lara H.
//Autor
//descripcion de funcionamiento
/*
Aqui se cargan los formularios de agregar y modificar, ademas se generan las validacions correspondientes
como validar campos vacion, que esten escritos correctamente y que sean igual que las validaciones se piden
tambien se inyecta codigo html y clases de css desde este archivo.
Calquier duda consultar con el autor
*/

// Esta funcion que permite cargar los formularios de agregar Docente y modificarlo, no desde function.js
function loadFormJMateria(opc, id = "") {
  let url = "";
  if (opc === "frmMateria") {
    url = "materia/frmMateria.php";
  } else if (opc === "modMateria") {
    url = "materia/modMateria.php";
  }

  let datas = { id: id };

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
                                BuscarDocente(id);
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

//funcion que permite realizar validaciones de los campoos correspondientes
//al momento de insertar o actualizar datos
//para ellos se obtiene los valores que ingreso el ususrio
function validarCamposmateria(opc) {
  // Obtenemos los valores que el usuario ingreso por medio de las etiquetas
  //utlizamos getEelemtById o querySelector
  const claveCarrera = document.querySelector("#clavemateria");
  const nombremateria = document.querySelector("#nombremateria");
  const horPracticas = document.querySelector("#horasPracticas");
  const horTeoricas = document.querySelector("#horasTeoricas");
  const numUnidades = document.querySelector("#numUnidades");
  const numcreditos = document.querySelector("#creditos");
  const claveCar = document.querySelector("#claveCarrera");
  const estado = document.querySelector("#statusId");
  //se limpian los valores
  const clavePrimaria = claveCarrera.value.trim();
  const nombremat = nombremateria.value.trim();
  const practicas = horPracticas.value.trim();
  const teoricas = horTeoricas.value.trim();
  const unidades = numUnidades.value.trim();
  const creditos = numcreditos.value.trim();
  const claveDeCarrera = claveCar.value.trim();
  const status = estado.value;

  //formato de clave 1
  const formatoValido = /^[A-Z]{3}-\d{4}$/;
  //formato de clave 2
  const formatoCarrera = /^[A-Z]{4}-\d{4}-\d{3}$/;
  //formato de nombre
  let regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  const noNegativos =
    practicas >= 1 && teoricas >= 1 && unidades >= 1 && creditos >= 1;

  const nadaVacio =
    clavePrimaria !== "" &&
    nombremat !== "" &&
    practicas !== "" &&
    teoricas !== "" &&
    unidades !== "" &&
    creditos !== "" &&
    claveDeCarrera !== "" &&
    status !== "";

  //deshabilitarboton
  switch (opc) {
    case "guardar":
      if (!nadaVacio) {
        marcarError(claveCarrera, clavePrimaria);
        marcarError(nombremateria, nombremat);
        marcarError(horPracticas, practicas);
        marcarError(horTeoricas, teoricas);
        marcarError(numUnidades, unidades);
        marcarError(numcreditos, creditos);
        marcarError(claveCar, claveDeCarrera);
        marcarError(estado, status);
        mostrarErrorCaptura(
          "No se pueden dejar campos vacios. Verifique e intente de nuevo"
        );
        deshabilitarboton(true, "btnGuardarJ");
      } else if (
        !formatoValido.test(clavePrimaria) ||
        !formatoCarrera.test(claveDeCarrera)
      ) {
        mostrarErrorCaptura("Clave Invalida, Verifique");
        marcarErrorFormato(claveCarrera, clavePrimaria, formatoValido);
        marcarErrorFormato(claveCar, claveDeCarrera, formatoCarrera);
      } else if (!regexNombre.test(nombremat)) {
        mostrarErrorCaptura(
          "Nombre inválido. Solo se permiten letras y espacios"
        );
        nombremateria.classList.add("entrada-error");
        nombremateria.classList.add("is-invalid");
        nombremateria.focus();
        console.log(nombremat);
        deshabilitarboton(true, "btnGuardarJ");
      } else if (!noNegativos) {
        mostrarErrorCaptura(
          "Los numeros negativos no se permiten. Verifique en estos canpos"
        );

        horPracticas.classList.add("entrada-error");
        horPracticas.classList.add("is-invalid");
        horTeoricas.classList.add("entrada-error");
        horTeoricas.classList.add("is-invalid");
        numUnidades.classList.add("entrada-error");
        numUnidades.classList.add("is-invalid");
        numcreditos.classList.add("entrada-error");
        numcreditos.classList.add("is-invalid");
      } else {
        limpiarErrores("entrada-error", "is-invalid");
        intentarGuardarDatosmateria("add");
        deshabilitarboton(true, "btnGuardarJ");
      }

      break;
    //validaciones para el formulario de modificar
    case "modificar":
      if (!nadaVacio) {
        marcarError(claveCarrera, clavePrimaria);
        marcarError(nombremateria, nombremat);
        marcarError(horPracticas, practicas);
        marcarError(horTeoricas, teoricas);
        marcarError(numUnidades, unidades);
        marcarError(numcreditos, creditos);
        marcarError(claveCar, claveDeCarrera);
        marcarError(estado, status);
        mostrarErrorCaptura(
          "No se pueden dejar campos vacios. Verifique e intente de nuevo"
        );
        deshabilitarboton(true, "btnGuardarJ");
      } else if (
        !formatoValido.test(clavePrimaria) ||
        !formatoCarrera.test(claveDeCarrera)
      ) {
        mostrarErrorCaptura("Clave Invalida, Verifique");
        marcarErrorFormato(claveCarrera, clavePrimaria, formatoValido);
        marcarErrorFormato(claveCar, claveDeCarrera, formatoCarrera);
      } else if (!regexNombre.test(nombremat)) {
        mostrarErrorCaptura(
          "Nombre inválido. Solo se permiten letras y espacios"
        );
        nombremateria.classList.add("entrada-error");
        nombremateria.classList.add("is-invalid");
        nombremateria.focus();
        console.log(nombremat);
        deshabilitarboton(true, "btnGuardarJ");
      } else if (!noNegativos) {
        mostrarErrorCaptura(
          "Los numeros negativos no se permiten. Verifique en estos canpos"
        );

        horPracticas.classList.add("entrada-error");
        horPracticas.classList.add("is-invalid");
        horTeoricas.classList.add("entrada-error");
        horTeoricas.classList.add("is-invalid");
        numUnidades.classList.add("entrada-error");
        numUnidades.classList.add("is-invalid");
        numcreditos.classList.add("entrada-error");
        numcreditos.classList.add("is-invalid");
      } else {
        limpiarErrores("entrada-error", "is-invalid");
        intentarGuardarDatosmateria("mod");
        deshabilitarboton(true, "btnGuardarJ");
      }

      break;
  }
}

//funcion que permite hacer el guardado correcto de los datos o actualizarlos
function intentarGuardarDatosmateria(opc) {
  try {

    //Aqui se cargan las funciones que permiten guardar o modificar los datos
    if (opc === "add") mostrarDatosGuardados("datos Guardados Correctamente");
    else if (opc === "mod") {
      mostrarDatosGuardados("datos Modificados Correctamente");
    }
  } catch (error) {
    // en caso de una falla se deabilita el boton y se muestra el modal con el problema
    ErrorDeIntentoDeGuardado("Error al intentar Guardar los datos");
    deshabilitarbtnCarrera(true, "btnGuardarJ");
  }
}

// funcion que permite evaluar los campos que esten correctamente mientras el usuario escribe
function verificarInputmateria(idetiqueta, idbtn, contenido) {
  let input = document.getElementById(idetiqueta);
  const valor = input.value.trim();
  const estaVacio = valor === "";
  const iconerror = document.querySelector(`#${idetiqueta}`);
  const contenedor = input.closest(`.${contenido}`);
  const errorPrevio = contenedor.querySelector(".errorscaracter");

  if (errorPrevio) {
    errorPrevio.remove();
    input.classList.remove("entrada-error");
    iconerror.classList.remove("is-invalid");
  }

  // Validaciones por tipo de campo
  switch (idetiqueta) {
    case "clavemateria":
      const regexClavec = /^[A-Z]{3}-\d{4}$/;

      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioMateria(idbtn);
      }
      if (!regexClavec.test(valor)) {
        mostrarError(
          input,
          "Solo se permite tres letras al inicio un guin medio y 4 dijitos ejem: AEB-1011",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioMateria(idbtn);
      }
      if (regexClavec.test(valor)) {
        //Ingresa el nombre de la funcion que se encarga de revisar si la clave ya esta en la base de datos y borra el comentario Gracias :)
        /* NombreDeTuFuncion(valor, function (existe) {
          if (existe) claveExiste(iconerror, input);
           evaluarEstadoFormularioMateria(idbtn);
        });*/
      }
      break;

    case "nombremateria":
      const soloLetras = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/;
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioMateria(idbtn);
      }
      if (!soloLetras.test(valor)) {
        mostrarError(
          input,
          "No se permiten caracteres especiales. Solo letras y espacios.",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioMateria(idbtn);
      }
      break;
    case "claveCarrera":
      const Clavecarrera = /^[A-Z]{4}-\d{4}-\d{3}$/;
      if (estaVacio) {
        mostrarErrorCarrera(input, "Este campo no puede estar vacío.");
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariocarrera(idbtn);
      }
      if (!Clavecarrera.test(valor)) {
        mostrarError(
          input,
          "Solo se permite cuatro letras mayusculas al inicio, un guión -, 4 dijitos y 3 dijitos al final. Ejem. IINF-2010-220",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioMateria(idbtn);
      }
      break;

    case "horasPracticas":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioMateria(idbtn);
      }
      if (valor <= 0) {
        mostrarError(input, "No se permiten 0 o numeros negativos", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioMateria(idbtn);
      }
      break;
    case "horasTeoricas":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioMateria(idbtn);
      }
      if (valor <= 0) {
        mostrarError(input, "No se permiten 0 o numeros negativos", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioMateria(idbtn);
      }
      break;
    case "numUnidades":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioMateria(idbtn);
      }
      if (valor <= 0) {
        mostrarError(input, "No se permiten 0 o numeros negativos", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioMateria(idbtn);
      }
      break;
    case "creditos":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioMateria(idbtn);
      }
      if (valor <= 0) {
        mostrarError(input, "No se permiten 0 o numeros negativos", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioMateria(idbtn);
      }
      break;
  }
  evaluarEstadoFormularioMateria(idbtn);
}

// funcion que permite evaluar campos que todo se este cumpliendo adecuadamente.
// manda a llamar la funcion para habilitar o desabilitar el boton de acuerdo si todo esta bien
function evaluarEstadoFormularioMateria(idbtn) {
  const clave = document.getElementById("clavemateria");
  const nombre = document.getElementById("nombremateria");
  const clavec = document.getElementById("claveCarrera");
  const horPracticas = document.querySelector("#horasPracticas");
  const horTeoricas = document.querySelector("#horasTeoricas");
  const numUnidades = document.querySelector("#numUnidades");
  const numcreditos = document.querySelector("#creditos");

  const errores = document.querySelectorAll(".errorscaracter");

  const camposLlenos =
    clave.value.trim() !== "" &&
    nombre.value.trim() !== "" &&
    clavec.value.trim() !== "" &&
    horPracticas.value.trim() !== "" &&
    horTeoricas.value.trim() !== "" &&
    numUnidades.value.trim() !== "" &&
    numcreditos.value.trim() !== "";

  const claveValida = /^[A-Z]{3}-\d{4}$/.test(clave.value.trim());
  const nombreValido = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/.test(nombre.value.trim());
  const clavecar = /^[A-Z]{4}-\d{4}-\d{3}$/.test(clavec.value.trim());

  const todoBien =
    errores.length === 0 &&
    camposLlenos &&
    claveValida &&
    nombreValido &&
    clavecar;

  deshabilitarboton(!todoBien, idbtn); // true = deshabilita, false = habilita
}

// funcion para inyectar opciones al select
//espero esto sea de ayuda xd

/* la opcion 'add' es para inyectar las opciones en el select en el formulario de agregar
las reglas cambian para modificar opcion 'mod', por eso sera distinto el codigo?
esto es por que hora tiene que ir un nombre con su clave al dar en el boton de editar
dependiendo del id de la materia se cargara la clave de carrera y su nombre con el que se guardo
ademas en la lista de despliege aparecera las demas  carrera por si el usuario quiere cambiar de carrera
*/
//Para Mandar a llamar la funcion bueno lo que se hace es que se ingresa el id de carrera que esta asociado al Id de materia y este lo cargara
//ejemplo cargarNombresMateria(opc, idJefeCarrera) opc se remplaza por mod y id por ENCI-1234-963
//en esta ocacion la llamada de funciones se realiza desde funcionesGlobales.js que esta en la carpeta JS ahi se muestra un ejemplo
//esto se hace con el fin de tener mas control sobre las funciones y evitar la repeticion de cosigo innesesario
function cargarNombresMateria(opc, idcarrera) {
  //Modifiquen lo que sea nesesario
  switch (opc) {
    case "add":
      $.ajax({
        url: "../../Controlador/Intermediarios/", //hay que colocar la url correcta
        type: "GET",
        dataType: "json",
        success: function (respuesta) {
          const select = $("#listaNombres");
          select.empty();
          select.append(
            "<option disabled selected>Seleccione un nombre</option>"
          );

          // Llenar el select con datos de la BD
          respuesta.forEach(function (carrera) {
            select.append(
              `<option value="${carrera.clave}" data-clave="${carrera.clave}">${carrera.nombre}</option>`
            );
          });

          // Evento para actualizar la clave cuando se seleccione una carrera
          select.off("change").on("change", function () {
            const claveSeleccionada =
              $(this).find("option:selected").data("clave") || "";
            $("#claveCarrera").val(claveSeleccionada);
          });
        },
        error: function (xhr, status, error) {
          console.error("Error al cargar carreras:", status, error);
          mostrarErrorCaptura("Error al cargar nombres de carrera.");
        },
      });
      break;
    //esta parte se usa para inyectar opc prederteminadas en el <select> del formulario modificar
    case "mod":
      $.ajax({
        url: "../../Controlador/Intermediarios/", //hay que colocar la url correcta
        type: "GET",
        dataType: "json",
        success: function (respuesta) {
          const select = $("#listaNombres");
          select.empty();

          let claveSeleccionada = "";

          if (!idcarrera) {
            select.append(
              "<option disabled selected>Seleccione un nombre</option>"
            );
          }

          // se cargan las opc
          respuesta.forEach(function (carrera) {
            const esSeleccionado = carrera.clave === idcarrera;

            if (esSeleccionado) {
              claveSeleccionada = carrera.clave;
            }
            select.append(`
                                <option value="${
                                  carrera.clave
                                }" data-id="${carrera.id}" data-clave="${carrera.clave}" ${esSeleccionado ? "selected" : ""}>
                                    ${carrera.nombre}
                                </option>
                            `);
          });

          $("#claveCarrera").val(claveSeleccionada);
          console.log("Clave seleccionada:", claveSeleccionada || "[VACÍO]");

          select.off("change").on("change", function () {
            const nuevaClave =
              $(this).find("option:selected").data("clave") || "";
            $("#claveCarrera").val(nuevaClave);
          });
        },
        error: function (xhr, status, error) {
          console.error("Error al cargar carrera :", status, error);
          mostrarErrorCaptura("Error al cargar nombres de carrera.");
        },
      });
      break;
  }
}

function changeStatusMateria(id, status, currentStatus) {
  // Si no hay un estado seleccionado (opción por defecto), no hacer nada
  if (!status || status === "Cambiar estado") {
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
                    <p class="text-center">¿Está seguro de cambiar el estado de la materia <strong>${id}</strong> a <strong>${status}</strong>?</p>
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

      console.log(`Cambiando estado de carrera ${id} a ${status}`);

      // Realizar petición AJAX para cambiar el estado
      $.ajax({
        url: "../../Controlador/Intermediarios/Materia/CambiarEstadoMateria.php",
        type: "POST",
        data: json,
        contentType: "application/json",
        timeout: 10000, // 10 segundos de timeout
        success: function (response) {
          try {
            if (typeof response === "string") {
              response = JSON.parse(response);
            }

            if (response.estado === "OK") {
              mostrarDatosGuardados(
                `El estado de la carrera ${id} ha sido cambiado a "${
                  status === "1" ? "Activo" : "Inactivo"
                }" correctamente.`,
                function () {
                  option("materia", "");
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
