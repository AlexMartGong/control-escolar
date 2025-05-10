//Autor Miguel Angel Lara Hermosillo
/*
Descripcion
Este archivo ayuda a evitar la repeticion de codigo, generando funciones con parametros
para poder hacer lo mismo pero en diferentes modulos
*/


//funcion para habilitar o desabilitar en timpo real
function deshabilitarboton(estado, botonId) {
  let boton = document.getElementById(botonId);
  //console.log('El estado es ',estado)
  if (boton) {
    boton.disabled = estado; // Deshabilita si `estado` es `true`, habilita si es `false`
  } else {
    console.error("Botón no encontrado con ID:", botonId);
  }
}

// Función para marcar error en un campo vacío
function marcarError(input, valor) {
  if (valor === "") {
    input.classList.add("entrada-error");
    input.classList.add("is-invalid");
  } else {
    input.classList.remove("entrada-error");
    input.classList.remove("is-invalid");
    //desabilitar boton
    deshabilitarbtnDocente(true, "btnGuardarJ");
  }
}
//esta funcion nos permite marcar al usuario errros en las clves
// se nos pide tres para metros etiqueta, valor y formato
//etique para saver sonde colocar las clases con el erro
// valor es para saber que es lo que tiene y formato es para compara si el valor es el correcto
//con el formato
function marcarErrorFormato(etiqueta, valor, formato) {
  console.log("Formato no valido");
  if (!formato.test(valor)) {
    etiqueta.classList.add("entrada-error");
    etiqueta.classList.add("is-invalid");
  } else {
    etiqueta.classList.remove("entrada-error");
    //desabilitar boton
    deshabilitarbtnDocente(true, "btnGuardarJ");
  }
}
//funcion para mostrar el error de escritura
function mostrarError(input, mensaje, contenedor) {
  const contenedorCampo = input.closest(`.${contenedor}`);

  // Sequita el error si ya existia antes
  const errorPrevio = contenedorCampo.querySelector(".errorscaracter");
  if (errorPrevio) errorPrevio.remove();
  const alerta = document.createElement("p");
  alerta.textContent = mensaje;
  alerta.classList.add("errorscaracter");
  contenedorCampo.appendChild(alerta); // Insertamos debajo del input group y dentro del contenedorcampo

  /* por si quieren despues de 5 seg desarapecer el parrafo
    setTimeout(() => {
        alerta.remove();
    }, 5000);*/
}

// funcion que permite Añadir un comentario si la clave Ya existe
function claveExiste(iconerror, input) {
  mostrarErrorCarrera(input, "La clave ya existe intente con otra.");
  iconerror.classList.add("is-invalid");
  input.classList.add("entrada-error");
}

//funcion que permite limpiar errores de clases
function limpiarErrores(clase, clase2) {
  // Selecciona todos los elementos que tengan la clase 'entrada-error'
  const elementos = document.querySelectorAll("." + clase);
  const elementos2 = document.querySelectorAll("." + clase2);

  elementos.forEach((el) => el.classList.remove(clase));
  elementos2.forEach((el) => el.classList.remove(clase2));
}

// Esta funcion permite generar simulaciones para inyectar opciones en un <select>
//se tiene que cambiar los id delo getElementById

//esta funcion solo es llamda cuando se seleciona una opcion en el <select> primero se agregan los datos y despues validan
function retrasoSelect(idetiqueta, idbtn, modulo, contenedor) {
  switch (modulo) {
    case "carrera":
      setTimeout(() => {
        verificarInputcarrera(idetiqueta, idbtn);
      }, 500);
      break;
    case "materia":
      setTimeout(() => {
        verificarInputmateria(idetiqueta, idbtn, contenedor);
      }, 500);
      break;
  }
}
//funcion que ejecutara con un retraso predeterminado a las funciones
/*
esto con el objetivo de que se carge primero el la inyeccion del html al DOM
y despues se ejecute el codigo y se inyecten las opciones al <select>
esta funcion se manda a llamar desde main.php
para el formulario de agregar el id no se nesesita y en modificar si, pero ya quedo resuelto
el perametro modulo solo es para el Switch
*/ 
function cargaRetrasadaDeDatos(opc, id, modulo) {
  //No tocar este
  switch (modulo) {
    case "carrera":
      setTimeout(() => {
        cargarNombresEnSelect(opc, id);
      }, 1000);
      break;
    //Aqui se agregara la funcion que permite insertar las opciones de carrera en materia
    case "materia":
      setTimeout(() => {
        cargarNombresMateria(opc, id) // esta es la opcion correcta el id se usa para la  carrera
      }, 1000);
      break;
  }
}

function simulacion() {
  const select = document.getElementById("listaNombres");
  const inputClave = document.getElementById("claveCarrera");

  const opciones = [
    { nombre: "Matematicas", clave: "TEDP-6935-963" },
    { nombre: "Geografia", clave: "TEDO-4821-963" },
    { nombre: "Ingles 1", clave: "TEDA-7740-369" },
  ];

  // Agregar opciones al select
  opciones.forEach((op) => {
    const opcion = document.createElement("option");
    opcion.value = op.clave;
    opcion.textContent = op.nombre;
    select.appendChild(opcion);
  });

  // Escuchar el cambio de selección
  select.addEventListener("change", function () {
    inputClave.value = this.value;
  });
}
  