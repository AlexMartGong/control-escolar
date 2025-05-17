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
function loadFormOferta(opc, id = "") {
  let url = "";
  if (opc === "frmOferta") {
    url = "oferta/frmOferta.php";
  } else if (opc === "modOferta") {
    url = "oferta/modOferta.php";
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
              /*

                
             */
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
function validarfrmOferta(opc) {
  // Obtenemos los valores que el usuario ingreso por medio de las etiquetas
  const idOferta = document.querySelector("#idOferta");
  const idsemestre = document.querySelector("#idSemestre");
  const idGrupo = document.querySelector("#idGrupo");
  const claveCarrera = document.querySelector("#claveCarrera");
  const claveMateria = document.querySelector("#claveMateria");
  const claveDocente = document.querySelector("#claveDocente");
  const idturno = document.querySelector("#turno");
  const idestado = document.querySelector("#IdPeriod");

  //se limpian los valores
  const oferta = idOferta.value.trim();
  const semestre = idsemestre.value.trim();
  const grupo = idGrupo.value.trim();
  const carrera = claveCarrera.value.trim();
  const materia = claveMateria.value.trim();
  const docente = claveDocente.value.trim();
  const turno = idturno.value;
  const idPeriodo = idestado.value.trim();

  const noNegativos = semestre >= 1 && semestre <= 12;

  const campos = [
    [idOferta, oferta],
    [idsemestre, semestre],
    [idGrupo, grupo],
    [claveCarrera, carrera],
    [claveMateria, materia],
    [claveDocente, docente],
  ];

  const nadaVacio = campos.every(([_, valor]) => valor.trim() !== "");

  switch (opc) {
    case "agregar":
      if (!nadaVacio || !noNegativos) {
        campos.forEach(([elemento, valor]) => {
          marcarError(elemento, valor);
        });

        if (!noNegativos) {
          marcarError(idsemestre, "");
          mostrarErrorCaptura(
            "El semestre debe ser un número mayor o igual a 1 Y menor o igual a 12"
          );
        } else {
          mostrarErrorCaptura(
            "No se pueden dejar campos vacíos. Verifique e intente de nuevo."
          );
          marcarError(idsemestre, "1");
        }
        if (turno === "Seleccione un turno") {
          const valor = "";
          marcarError(idturno, valor);
        } else {
          marcarError(idturno, turno);
        }
        if (idPeriodo === "") {
          const valor = "";
          marcarError(idestado, valor);
        } else {
          marcarError(idestado, idPeriodo);
        }
      } else {
        limpiarErrores("entrada-error", "is-invalid");
        if (
          existeOfertaEnTabla(
            semestre,
            grupo,
            turno,
            carrera,
            docente,
            idPeriodo,
            materia
          )
        ) {
          // en caso de que oferta exista se manda a llamar al modal
          ErrorDeIntentoDeGuardado(
            "Advertencia. Ya quexiste un periodo con los mimos parametros"
          );
        } else {
          //si no existe valores repetidos entonces ahora se agregar a la tabla
          agregarOfertaTabla();
        }

        deshabilitarboton(true, "btnAgregarOferta");
      }

      break;
    // validaciones antes de aguardar en modificar
    case "modificar":
      if (!nadaVacio || !noNegativos) {
        campos.forEach(([elemento, valor]) => {
          marcarError(elemento, valor);
        });

        if (!noNegativos) {
          marcarError(idsemestre, "");
          mostrarErrorCaptura(
            "El semestre debe ser un número mayor o igual a 1 Y menor o igual a 12"
          );
        } else {
          mostrarErrorCaptura(
            "No se pueden dejar campos vacíos. Verifique e intente de nuevo."
          );
          marcarError(idsemestre, "1");
        }
        if (turno === "Seleccione un turno") {
          const valor = "";
          marcarError(idturno, valor);
        } else {
          marcarError(idturno, turno);
        }
        if (idPeriodo === "") {
          const valor = "";
          marcarError(idestado, valor);
        } else {
          marcarError(idestado, idPeriodo);
        }
      } else {
        limpiarErrores("entrada-error", "is-invalid");
        intentarGuardarDatosOferta("mod");
        deshabilitarbtnCarrera(true, "btnGuardarJ");
      }

      break;
  }
}

// funcion que permite el control de guadado o modificado
function intentarGuardarDatosOferta(opc) {
  try {
    //Aqui se cargan las funciones que permiten guardar o modificar los datos
    if (opc === "add") {
      //aqui se genera la funcion para validar si la oferta ya existe retorna un true o false
      // si todo esta bien se realiza la funcion para aguardar la oferta y se limpia el formulario
      mostrarDatosGuardados("Exito"); // esta se cambia por la funcion que se nesesita para guardar
      deshabilitarboton(true, "btnGuardarJ");
      limpiarTablaall();
    }
    // si el caso es de modifcacion aqui se manda a llamar la funcion para modificar.
    else if (opc === "mod") {
      mostrarDatosGuardados("Datos exito Modificados");
    }
  } catch (error) {
    // en caso de una falla se deabilita el boton y se muestra el modal con el problema
    ErrorDeIntentoDeGuardado("Error al intentar Guardar los datos");
    deshabilitarbtnCarrera(true, "btnGuardarJ");
  }
}

function verificarEntradasOferta(idetiqueta, idbtn, contenido) {
  // funcion que permite evaluar los campos que esten correctamente mientras el usuario escribe
  let input = document.getElementById(idetiqueta);
  const valor = input.value.trim();
  const estaVacio = valor === "";
  const iconerror = document.querySelector(`#${idetiqueta}`);
  const contenedor = input.closest(`.${contenido}`);
  const errorPrevio = contenedor.querySelector(".errorscaracter");
  //contantes que ayudaran a tener un mejor control de validaciones
  let regex = /^[A-Z]{4}-\d{4}-\d{3}$/; //aqui espesificamos que como de ver el formato de la claveCarrera
  const regexClavec = /^[A-Z]{3}-\d{4}$/; // formato clave materia y docente son iguales

  const soloLetras = /^[a-zA-Z]+$/;
  const patronNumerico = /^[0-9]+$/;

  if (errorPrevio) {
    errorPrevio.remove();
    input.classList.remove("entrada-error");
    iconerror.classList.remove("is-invalid");
  }

  // Validaciones por tipo de campo
  switch (idetiqueta) {
    case "idSemestre":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      if (valor <= 0 || valor > 12) {
        mostrarError(
          input,
          "solo se permite de mayor o igual a 1 y menor o igual a 12.",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      if (!patronNumerico) {
        mostrarError(
          input,
          "Este campo solo puede contemer numeros.",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      break;

    case "idGrupo":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      if (!soloLetras.test(valor)) {
        mostrarError(
          input,
          "Este campo solo puede contener una letra.",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }

      break;

    case "turno":
      if (valor === "Seleccione un turno") {
        const valor = "";
        mostrarError(input, "Selecciona una opcion.", contenido);
        marcarError(idetiqueta, valor);
        return evaluarEstadoFormulariooferta(idbtn);
      }
      break;

    case "claveCarrera":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      if (!regex.test(valor)) {
        mostrarError(
          input,
          "Solo se permite cuatro letras mayusculas al inicio, un guión -, 4 dijitos y 3 dijitos al final. Ejem. IINF-2010-220",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      break;
    case "claveDocente":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      if (!regexClavec.test(valor)) {
        mostrarError(
          input,
          "Solo se permite tres letras mayusculas al inicio, un guión medio - y 4 numeros. Ejem. TED-0001",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      break;
    case "claveMateria":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      if (!regexClavec.test(valor)) {
        mostrarError(
          input,
          "Solo se permite tres letras al inicio un guin medio y 4 dijitos ejem: AEB-1011",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      break;
    case "IdPeriod":
      const soloNumeros = /^\d+$/;
      if (!soloNumeros.test(valor)) {
        mostrarError(
          input,
          "Selecciona una opción válida (solo números).",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      break;
  }
  evaluarEstadoFormulariooferta(idbtn);
}

function evaluarEstadoFormulariooferta(idbtn) {
  const idOferta = document.querySelector("#idOferta");
  const idsemestre = document.querySelector("#idSemestre");
  const idGrupo = document.querySelector("#idGrupo");
  const claveCarrera = document.querySelector("#claveCarrera");
  const claveMateria = document.querySelector("#claveMateria");
  const claveDocente = document.querySelector("#claveDocente");
  const idturno = document.querySelector("#turno");
  const idperiod = document.querySelector("#IdPeriod");

  //se limpian los valores
  const oferta = idOferta.value.trim();
  const semestre = idsemestre.value.trim();
  const grupo = idGrupo.value.trim();
  const carrera = claveCarrera.value.trim();
  const materia = claveMateria.value.trim();
  const docente = claveDocente.value.trim();
  const turno = idturno.value;
  const periodo = idperiod.value.trim();
  const errores = document.querySelectorAll(".errorscaracter");

  const camposCorrectos =
    oferta !== "" &&
    semestre !== "" &&
    grupo !== "" &&
    carrera !== "" &&
    materia !== "" &&
    docente !== "" &&
    turno !== "Seleccione un turno" &&
    periodo !== "";

  const clavecar = /^[A-Z]{4}-\d{4}-\d{3}$/.test(claveCarrera.value.trim());
  const clavedo = /^[A-Z]{3}-\d{4}$/.test(claveDocente.value.trim());
  const claveValidamat = /^[A-Z]{3}-\d{4}$/.test(claveMateria.value.trim());
  //console.log("campos llaves?", clavecar, " ", clavedo, " ", claveValidamat);

  const todoBien =
    errores.length === 0 &&
    camposCorrectos &&
    clavedo &&
    claveValidamat &&
    clavecar;

  deshabilitarboton(!todoBien, idbtn); // true = deshabilita, false = habilita
}

//funcion que se encarga de agregar los datos ala tabla
function agregarOfertaTabla() {
  const tablaOferta = $("#TablaDatosOferta").DataTable();

  const idOferta = $("#idOferta").val();
  const semestre = $("#idSemestre").val();
  const estado = $('input[name="estado"]:checked').val();
  const grupo = $("#idGrupo").val();
  const turno = $("#turno").val();
  const nombreCarrera = $("#listaCarrera option:selected").text();
  const claveCarrera = $("#claveCarrera").val();
  const nombreDocente = $("#listaDocente option:selected").text();
  const claveDocente = $("#claveDocente").val();
  const periodo = $("#listaPeriodo option:selected").text();
  const idPeriodo = $("#IdPeriod").val();
  const nombreMateria = $("#listaMateria option:selected").text();
  const claveMateria = $("#claveMateria").val();
  const botonAcciones = `
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-danger" title="Eliminar" onclick="eliminarFila(this)">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                        `;

  const badgeEstado =
    estado === "No asignado"
      ? '<span class="badge bg-success">Asigando</span>'
      : '<span class="badge bg-danger">No asignado</span>';

  // Insertar la fila
  tablaOferta.row
    .add([
      idOferta,
      semestre,
      badgeEstado,
      grupo,
      turno,
      nombreCarrera,
      claveCarrera,
      nombreDocente,
      claveDocente,
      periodo,
      idPeriodo,
      nombreMateria,
      claveMateria,
      botonAcciones,
    ])
    .draw(false);
  HayFilasEnTabla();

  //limpio partes del form
  $('#camposVacios input').val('');
  $('#listaMateria').val('Seleccione una Materia').trigger('change.select2');
  $('#listaDocente').val('Seleccione un docente').trigger('change.select2');

}

// funcion para eliminar la fila de la tabla
function eliminarFila(boton) {
  const tabla = $("#TablaDatosOferta").DataTable();
  tabla.row($(boton).parents("tr")).remove().draw();
  HayFilasEnTabla();
}

// funcion que limpia la tabla al aguardar datos, toda la tabla
function limpiarTablaall() {
  const tabla = $("#TablaDatosOferta").DataTable();
  tabla.clear().draw();
}

//funcion que permite validar que no exitan registro con los mismo parametros
function existeOfertaEnTabla(
  semestre,
  grupo,
  turno,
  claveCarrera,
  claveDocente,
  idPeriodo,
  claveMateria
) {
  const tabla = $("#TablaDatosOferta").DataTable();
  const filas = tabla.rows().data();
  //console.log("Verificando si ya existe:", semestre, grupo, turno, claveCarrera, claveDocente, idPeriodo, claveMateria);

  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];

    if (
      fila[1] === semestre &&
      fila[3] === grupo &&
      fila[4] === turno &&
      fila[6] === claveCarrera &&
      fila[8] === claveDocente &&
      fila[10] === idPeriodo &&
      fila[12] === claveMateria
    ) {
      return true;
    }
  }

  return false;
}

// funcion que permite saber si hay filas o no en la tabla y habilita o desabilita el boton de guardar
function HayFilasEnTabla() {
  const tabla = $("#TablaDatosOferta").DataTable();
  const totalFilas = tabla.rows().count();

  if (totalFilas === 0) {
    deshabilitarboton(true, "btnGuardarJ"); // Desactiva
  } else {
    deshabilitarboton(false, "btnGuardarJ"); // Activa
  }
}
