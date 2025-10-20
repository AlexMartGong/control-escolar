//Autor: Miguel Angel Lara Hermosillo
//Fecha de creación: 08/09/2025
//Descripción: Funciones JS para el módulo de baja de alumnos manual

// Funcion que permite cargar los formularios de baja de alumnos
// y ejecutar las funciones necesarias para cada uno
function loadFormBajaAlumnos(opc, id = "") {
  let url = "";
  if (opc === "bajaManual") {
    url = "baja/bajaManual.php";
  } else if (opc === "modBaja") {
    url = "baja/modBaja.html";
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
              iniciarFuncionesBajaAlumnos(opc, id); // Iniciar funciones específicas para baja
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

// Función para validar los campos antes de enviar el formulario
function validarFormularioBaja() {
    const nombreAlumno = document.getElementById("nombreAlumno").value.trim();
    const carreraAlumno = document.getElementById("carreraAlumno").value.trim();
    const periodoAlumno = document.getElementById("periodo_nombre").value.trim();
    const motivoBaja = document.getElementById("motivoBaja").value.trim();
    const tipoBaja = document.getElementById("tipoBaja").value;
    const idperiodo = document.getElementById("idperiodo").value;

    // validar que los campos no esten vacios y que no tengan errores
    if (
        nombreAlumno === "" ||
        carreraAlumno === "" ||
        periodoAlumno === "" ||
        motivoBaja === "" ||
        tipoBaja === "" ||
        idperiodo === ""
    ) {
        // Mostrar mensaje de error
        mostrarFaltaDatos(
            "No se pueden dejar campos vacíos. Verifique e intente de nuevo."
        );
        return false;
    } else {
        // Si todo es correcto, enviar los datos al backend
        enviarBajaManual();
    }
}

//funcion para validar el numero de control al escribir
function validarNumeroControlBaja(idInput, btn, cont) {
  const input = document.getElementById(idInput);
  const bton = document.getElementById(btn);

  const valor = input.value.trim();
  const iconerror = document.querySelector(`#${idInput}`);
  const contenedor = input.closest("." + cont);

  const soloNumeros = /^[0-9]+$/; // Expresión regular para solo números

  /**Eliminar mensaje de error si existe**/

  // Buscar mensaje de error por mensaje
  const errorMensaje = contenedor.querySelector(".errorscaracter");
  if (errorMensaje) {
    errorMensaje.remove();
  }

  // Buscar otros errores (is-invalid) para eliminarlos si todo es correcto
  const errorInvalid = contenedor.querySelector(".is-invalid");
  if (errorInvalid) {
    errorInvalid.classList.remove("is-invalid");
    input.classList.remove("entrada-error");
  }

  // Validar si el valor está vacío o no coincide con el formato

  if (valor === "" || !soloNumeros.test(valor)) {
    input.classList.add("entrada-error");
    iconerror.classList.add("is-invalid");
    MostrarAlertaBaja(
      input,
      "El número de control debe ser solo números y no debe estar vacío.",
      cont
    );
    bton.disabled = true;
  } else {
    // Si todo es correcto se activa el boton
    bton.disabled = false;
  }
}

//validar el motivo de baja
function validarCamposRestantesBaja(idInput, btn, cont) {
  const input = document.getElementById(idInput);

  const bton = document.getElementById(btn);
  const valor = input.value.trim();
  const iconerror = document.querySelector(`#${idInput}`);
  const contenedor = input.closest("." + cont);

  /**Eliminar mensaje de error si existe**/

  // Buscar mensaje de error por mensaje
  const errorMensaje = contenedor.querySelector(".errorscaracter");
  if (errorMensaje) {
    errorMensaje.remove();
  }

  // Buscar otros errores (is-invalid) para eliminarlos si todo es correcto
  const errorInvalid = contenedor.querySelector(".is-invalid");
  if (errorInvalid) {
    errorInvalid.classList.remove("is-invalid");
    input.classList.remove("entrada-error");
  }

  switch (idInput) {
    case "idperiodo":
      if (valor === "") {
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        MostrarAlertaBaja(
          input,
          "Valor no encontrado del periodo, intenta de nuevo.",
          cont
        );
        return activarBotonSiTodoCorrectoBaja(bton);
      } else if (periodoYaRegistradobaja(valor)) {
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        MostrarAlertaBaja(
          input,
          "El alumno ya cuenta con una baja en el periodo seleccionado.",
          cont
        );
        return activarBotonSiTodoCorrectoBaja(bton);
      }
      break;
    case "motivoBaja":
      if (valor === "") {
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        MostrarAlertaBaja(
          input,
          "El motivo de baja no debe estar vacío.",
          cont
        );
        return activarBotonSiTodoCorrectoBaja(bton);
      }
      break;
  }
  activarBotonSiTodoCorrectoBaja(bton);
}

// Activa el botón de guardar si todos los campos están correctos
function activarBotonSiTodoCorrectoBaja(btnId) {
  // Campos requeridos
  const idsCampos = ["idperiodo", "motivoBaja", "tipoBaja"];

  const camposValidos = idsCampos.every((id) => {
    const input = document.getElementById(id);

    if (!input) return false; // por si algún id no existe

    const tieneError =
      input.classList.contains("entrada-error") ||
      input.classList.contains("is-invalid");

    const tieneValor = input.value && input.value.trim() !== "";

    return !tieneError && tieneValor;
  });

  btnId.disabled = !camposValidos;
}

//funcion para buscar alumno y mostrar sus datos,
function buscarAlumnoBaja() {
    if (!limpiarDatosDeCampo()) {
        mostrarMensajeBaja("Error, no se encontraron los campos para limpiarlos");
        setEstadoBajas("Error");
        return;
    }

    const noControl = document.getElementById("id_alumno").value.trim();
    const loader = document.getElementById("loader");

    // Ocultar datos previos y mostrar loader
    document.getElementById("alumnoInfo").classList.add("d-none");
    document.getElementById("datosAlumno").classList.add("d-none");
    document.getElementById("contenedorHistorial").classList.add("d-none");
    loader.classList.remove("d-none");

    // Llamar al backend para buscar alumno real
    $.ajax({
        url: '../../Controlador/Intermediarios/Baja/BuscarAlumno.php',
        type: 'POST',
        data: { noControl: noControl },
        dataType: 'json',
        success: function(response) {
            loader.classList.add("d-none"); // ocultar loader

            console.log('Respuesta del backend:', response); // ← PARA DEBUG

            if (response.estado === 'OK') {
                // Alumno válido encontrado
                mostrarMensajeBaja(
                    "El estado de la baja será 'Aplicada' por defecto",
                    true
                );
                setEstadoBajas("encontrado");

                document.getElementById("nombreAlumno").value = response.datos.nombre_de_alumno;
                document.getElementById("carreraAlumno").value = response.datos.nombre_de_carrera;

                // Cargar periodos disponibles
                cargarPeriodosDisponiblesBaja();

            } else {
                mostrarMensajeBaja(response.mensaje);
                setEstadoBajas("Error");
            }
        },
        error: function(xhr, status, error) {
            loader.classList.add("d-none");
            mostrarMensajeBaja("Error de conexión al buscar alumno.");
            setEstadoBajas("Error");
            console.error('Error en AJAX:', error);
        }
    });
}
// Función para cargar periodos disponibles
function cargarPeriodosDisponiblesBaja() {
    $.ajax({
        url: '../../Controlador/Intermediarios/Parcial/ObtenerPeriodosDisponibles.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log('Periodos recibidos:', response);
            
            if (response.estado === 'OK') {
                const selectPeriodo = document.getElementById("periodo_nombre");
                selectPeriodo.innerHTML = '<option value="" disabled selected>Seleccione un periodo</option>';
                
                response.datos.forEach(periodo => {
                    const option = document.createElement("option");
                    option.value = periodo[0];
                    option.textContent = periodo[1];
                    selectPeriodo.appendChild(option);
                });
                
                console.log('Periodos cargados en select:', selectPeriodo.innerHTML);
            } else {
                mostrarErrorCaptura("Error al cargar periodos: " + response.mensaje);
            }
        },
        error: function(xhr, status, error) {
            mostrarErrorCaptura("Error de conexión al cargar periodos.");
            console.error('Error cargando periodos:', error);
        }
    });
}

// Funcion que limpia los campos antes de mostrar nuevos datos
function limpiarDatosDeCampo() {
  let seEncontraron = true;

  let campos = ["periodo_nombre", "idperiodo", "tipoBaja", "motivoBaja"];

  for (let id of campos) {
    let el = document.getElementById(id);
    if (el) {
      if (el.tagName === "SELECT") {
        el.selectedIndex = 0;
      } else if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
        el.value = "";
      }
    } else {
      seEncontraron = false;
    }
  }

  return seEncontraron;
}

// Funcion que permite saber si un alumno ya cuenta con una baja en un periodo en espesifico
function periodoYaRegistradobaja(idPeriodo) {
  const filas = document.querySelectorAll("#tablaHistorial tr");
  let existe = false;

  filas.forEach((fila) => {
    const id = fila.cells[0].textContent.trim(); // primera celda = ID Periodo
    if (id === idPeriodo) {
      existe = true;
    }
  });

  return existe;
}

// Función auxiliar para mostrar mensajes en el setEstado
function mostrarMensajeBaja(texto, mostrarDatos = false) {
  const info = document.getElementById("alumnoInfo");
  const datos = document.getElementById("datosAlumno");

  info.classList.remove("d-none");
  info.textContent = texto;

  if (mostrarDatos) {
    datos.classList.remove("d-none");
  } else {
    datos.classList.add("d-none");
  }
}

function setEstadoBajas(estado) {
  const div = document.getElementById("alumnoInfoclass");

  // Quita las clases de Bootstrap que no correspondan
  div.classList.remove("alert-success", "alert-info", "alert-danger");

  switch (estado) {
    case "encontrado":
      div.classList.add("alert-success");
      break;
    case "Error":
      div.classList.add("alert-danger");
      break;
    default:
      div.classList.add("alert-info");
      break;
  }
}

// Función para mostrar alertas
function MostrarAlertaBaja(input, mensaje, contenedor) {
  const contenedorCampo = input.closest(`.${contenedor}`);
  // Sequita el error si ya existia antes
  const errorPrevio = contenedorCampo.querySelector(".errorscaracter");
  if (errorPrevio) errorPrevio.remove();
  const alerta = document.createElement("p");
  alerta.textContent = mensaje;
  alerta.classList.add("errorscaracter");
  contenedorCampo.appendChild(alerta); // Insertamos debajo del input group y dentro del contenedorcampo

  //Eliminar despues de 3 seg
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}

// funcion que permite iniciar otras funciones
function iniciarFuncionesBajaAlumnos(opc, id) {
  switch (opc) {
    case "buscarAlumno":
      buscarAlumnoBaja();
      break;
    case "modBaja":
      cargarDatosSelectPeriodosMod(function() {
       
        cargarDatosBaja(id);
    });
      break;
  }
}

// Función para enviar los datos de baja manual al backend
function enviarBajaManual() {
    // Obtener datos del formulario
    const noControl = document.getElementById("id_alumno").value.trim();
    const idPeriodo = document.getElementById("idperiodo").value.trim();
    const motivo = document.getElementById("motivoBaja").value.trim();
    const tipo = document.getElementById("tipoBaja").value;

    // Validar que todos los campos estén llenos
    if (!noControl || !idPeriodo || !motivo || !tipo) {
        mostrarErrorCaptura("Faltan datos necesarios para completar la operación.");
        return;
    }

    // Mostrar loader o indicador de carga
    const btnGuardar = document.getElementById("btnGuardarJ");
    const originalText = btnGuardar.innerHTML;
    btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Guardando...';
    btnGuardar.disabled = true;

    // Preparar datos para enviar
    const datos = {
        noControl: noControl,
        idPeriodo: idPeriodo,
        motivo: motivo,
        tipo: tipo
    };

    // Enviar datos al backend
    $.ajax({
        url: '../../Controlador/Intermediarios/Baja/AplicarBajaManual.php', // Ajusta la ruta según tu estructura
        type: 'POST',
        data: datos,
        dataType: 'json',
        success: function(response) {
            if (response.estado === 'OK') {
                mostrarDatosGuardados(response.mensaje);
                // Deshabilitar el formulario después de guardar exitosamente
                btnGuardar.disabled = true;
                
                // Opcional: Limpiar formulario después de éxito
                setTimeout(() => {
                    clearArea("frmArea");
                    option('baja','');
                }, 2000);
            } else {
                mostrarErrorCaptura(response.mensaje);
                // Rehabilitar botón en caso de error
                btnGuardar.innerHTML = originalText;
                btnGuardar.disabled = false;
            }
        },
        error: function(xhr, status, error) {
            mostrarErrorCaptura("Error de conexión al registrar la baja. Inténtalo de nuevo.");
            console.error("Error AJAX:", error);
            // Rehabilitar botón en caso de error
            btnGuardar.innerHTML = originalText;
            btnGuardar.disabled = false;
        }
    });
}