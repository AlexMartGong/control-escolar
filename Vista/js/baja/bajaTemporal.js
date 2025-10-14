// Datos de ejemplo - Periodo activo actual
const periodoActivo = {
    periodo: 'AGO-DIC-2025',
    fechaInicio: '01/08/2025',
    fechaCierre: '15/12/2025',
    estado: 'Activo',
    alumnos: [
        {
            noControl: '20400123',
            nombre: 'García López Juan Carlos',
            carrera: 'Ing. Informática',
            bajasPrevias: 0,
            tipoBaja: 'Temporal'
        },
        {
            noControl: '20400245',
            nombre: 'Martínez Rodríguez María Elena',
            carrera: 'Ing. Industrial',
            bajasPrevias: 1,
            tipoBaja: 'Temporal'
        },
        {
            noControl: '20400367',
            nombre: 'Hernández Silva Pedro Antonio',
            carrera: 'Ing. Sistemas',
            bajasPrevias: 2,
            tipoBaja: 'Temporal'
        },
        {
            noControl: '20400489',
            nombre: 'López Ramírez Ana Gabriela',
            carrera: 'Ing. Gestión',
            bajasPrevias: 3,
            tipoBaja: 'Definitiva'
        },
        {
            noControl: '20400512',
            nombre: 'Sánchez Torres Luis Fernando',
            carrera: 'Ing. Informática',
            bajasPrevias: 0,
            tipoBaja: 'Temporal'
        },
        {
            noControl: '20400634',
            nombre: 'Ramírez Gutiérrez Carmen Rosa',
            carrera: 'Ing. Industrial',
            bajasPrevias: 1,
            tipoBaja: 'Temporal'
        },
        {
            noControl: '20400756',
            nombre: 'González Medina Jorge Alberto',
            carrera: 'Ing. Sistemas',
            bajasPrevias: 3,
            tipoBaja: 'Definitiva'
        },
        {
            noControl: '20400878',
            nombre: 'Flores Castillo Diana Patricia',
            carrera: 'Ing. Gestión',
            bajasPrevias: 0,
            tipoBaja: 'Temporal'
        },
        {
            noControl: '20400901',
            nombre: 'Pérez Martínez Roberto Carlos',
            carrera: 'Ing. Informática',
            bajasPrevias: 2,
            tipoBaja: 'Temporal'
        },
        {
            noControl: '20401023',
            nombre: 'Torres Sánchez Laura Patricia',
            carrera: 'Ing. Industrial',
            bajasPrevias: 1,
            tipoBaja: 'Temporal'
        }
    ]
};

// Función para cargar automáticamente el periodo activo al iniciar
function cargarPeriodoActivo() {
    // Mostrar información del periodo

    const datosEnvio = {
        estadoP: "Abierto"
    };

    $.ajax({
        url: '../../Controlador/Intermediarios/Periodo/ObtenerPeriodosPorEstado.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(datosEnvio),
        dataType: 'json',
        success: function (respuesta) {

            console.log("Respuesta del Intermediario Buscar Periodos por Estado:", respuesta);

            if (respuesta.estado === 'OK') {

                const periodo = respuesta.datos[0]; // <- la primera entrada del array

                document.getElementById('periodoSeleccionado').textContent = periodo.periodo;
                document.getElementById('fechaInicio').textContent = periodo.fecha_de_inicio;
                document.getElementById('fechaCierre').textContent = periodo.fecha_de_termino;

            } else {
                mostrarErrorCaptura(respuesta.mensaje);
            }
        },

        error: function (xhr, status, error) {
            console.error("Error AJAX:", status, error);
            mostrarErrorCaptura("Ups… algo salió mal al cargar los datos del Periodo. Por favor, inténtalo otra vez.");

        }
    });

    // Cargar tabla y resumen
    cargarTablaAlumnos();

}

// Función para cargar la tabla de alumnos
function cargarTablaAlumnos() {

    const datosEnvio = {
        estadoA: "Baja"
    };

    $.ajax({
        url: '../../Controlador/Intermediarios/Alumno/ObtenerAlumnosPorEstado.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(datosEnvio),
        dataType: 'json',
        success: function (respuesta) {

            console.log("Respuesta del Intermediario Buscar Alumnos por Estado:", respuesta);

            if (respuesta.estado === 'OK') {

                const alumnos = respuesta.datos;

                const tbody = document.getElementById('tablaAlumnosBajaBody');
                tbody.innerHTML = '';

                alumnos.forEach(alumno => {
                    const badgeBajas = alumno.periodos_en_baja >= 3 ? 'bg-danger' : 'bg-info';

                    let badgeTipo;
                    switch (alumno.estado) {
                        case 'Activo':
                            badgeTipo = 'bg-success';
                            break;
                        case 'Baja Temporal':
                            badgeTipo = 'bg-warning';
                            break;
                        case 'Baja':
                            badgeTipo = 'bg-danger';
                            break;
                        case 'Baja Definitiva':
                            badgeTipo = 'bg-danger';
                            break;
                        default:
                            badgeTipo = 'bg-secondary';
                    }

                    const row = `
            <tr>
                <td>${alumno.numero_de_control}</td>
                <td>${alumno.nombre_de_alumno}</td>
                <td>${alumno.nombre_de_carrera}</td>
                <td><span class="badge ${badgeBajas}">${alumno.periodos_en_baja}</span></td>
                <td><span class="badge ${badgeTipo}">${alumno.estado}</span></td>
            </tr>
        `;
                    tbody.innerHTML += row;
                });

                actualizarResumen(alumnos);

            } else {
                mostrarErrorCaptura(respuesta.mensaje);
            }
        },

        error: function (xhr, status, error) {
            console.error("Error AJAX:", status, error);
            mostrarErrorCaptura("Ups… algo salió mal al cargar la información de los Alumnos. Por favor, inténtalo otra vez.");

        }
    });

}

// Función para actualizar el resumen numérico
function actualizarResumen(alumnos) {
    const total = alumnos.length;
    const temporal = alumnos.filter(a => a.tipoBaja === 'Temporal').length;
    const definitiva = alumnos.filter(a => a.tipoBaja === 'Definitiva').length;

    document.getElementById('totalAlumnos').textContent = total;
    document.getElementById('bajasTemporal').textContent = temporal;
    document.getElementById('bajasDefinitiva').textContent = definitiva;
}

// Función para confirmar la baja automática (abre el modal)
function confirmarBajaAutomatica() {
    const total = document.getElementById('totalAlumnos').textContent;
    const temporal = document.getElementById('bajasTemporal').textContent;
    const definitiva = document.getElementById('bajasDefinitiva').textContent;
    const nombreperiodo = document.getElementById('periodoSeleccionado').textContent;

    // Actualizar datos del modal
    document.getElementById('modalPeriodo').textContent = nombreperiodo;
    document.getElementById('modalTotal').textContent = total;
    document.getElementById('modalTemporal').textContent = temporal;
    document.getElementById('modalDefinitiva').textContent = definitiva;

    // Mostrar modal usando Bootstrap 5
    const modal = new bootstrap.Modal(document.getElementById('modalConfirmacionBaja'));
    modal.show();
}

// Función para ejecutar la baja automática (después de confirmar)
function ejecutarBajaAutomatica() {
    // Cerrar el modal
    const modalElement = document.getElementById('modalConfirmacionBaja');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    $.ajax({
        url: '../../Controlador/Intermediarios/Baja/AplicarBajasPorNoInscripcion.php',
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        success: function (respuesta) {

            console.log("Respuesta del Intermediario Aplicar Bajas:", respuesta);

            if (respuesta.estado === 'OK') {

                mostrarDatosGuardados('Baja automática ejecutada exitosamente.\n\nSe aplicó la baja a ' +
                    document.getElementById('totalAlumnos').textContent + ' alumnos del periodo ' + document.getElementById('periodoSeleccionado').textContent, function () {
                        cancelarBajaAutomatica();
                    });

            } else {
                mostrarErrorCaptura(respuesta.mensaje);
            }
        },

        error: function (xhr, status, error) {
            console.error("Error AJAX:", status, error);
            mostrarErrorCaptura("Ups… algo salió mal al intentar aplicar las bajas. Por favor, inténtalo otra vez.");

        }
    });

}

// Función para cancelar y regresar
function cancelarBajaAutomatica() {
    // Resetear botón
    const btnEjecutar = document.getElementById('btnEjecutarBaja');
    btnEjecutar.disabled = false;
    btnEjecutar.innerHTML = '<i class="fas fa-check-circle me-2"></i>Ejecutar Baja Automática';

    // Regresar a la vista principal de baja (si existe función option)
    if (typeof option === 'function') {
        option('baja', '');
    }
}

// Inicialización cuando se carga la página
$(document).ready(function () {
    console.log('Módulo de Baja Temporal cargado correctamente');
    // Solo cargar si el formulario de bajaTemporal existe en el DOM
    if ($('#frmBajaTemporal').length) {
        cargarPeriodoActivo();
    }
});
