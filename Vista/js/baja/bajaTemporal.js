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
        url: '../../Controlador/Intermediarios/Baja/MostrarBajasRealizadas.php',
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
                    switch (alumno.tipo_de_baja) {
                        case 'Baja Temporal':
                            badgeTipo = 'bg-warning';
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
                <td>${alumno.semestre}</td>
                <td>${alumno.grupo}</td>
                <td><span class="badge ${badgeBajas}">${alumno.periodos_en_baja}</span></td>
                <td><span class="badge ${badgeTipo}">${alumno.tipo_de_baja}</span></td>
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
            mostrarErrorCaptura("Ups… algo salió mal al cargar la información de las bajas. Por favor, inténtalo otra vez.");

        }
    });

}

// Función para actualizar el resumen numérico
function actualizarResumen(alumnos) {
    const total = alumnos.length;
    const temporal = alumnos.filter(a => a.tipo_de_baja === 'Baja Temporal').length;
    const definitiva = alumnos.filter(a => a.tipo_de_baja === 'Baja Definitiva').length;

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
 
    $.ajax({
        url: '../../Controlador/Intermediarios/Baja/AplicarBajasPorNoInscripcion.php',
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        success: function (respuesta) {

            if (respuesta.estado === 'OK') {

                mostrarDatosGuardados('Se han aplicado correctamente las Bajas pertinentes y se han preparado las calificaciones para su captura', function () {
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

/**
 * Función para aplicar el cierre de ajustes
 * Valida la fecha de término de ajustes y la fecha de cierre de inscripciones
 * antes de ejecutar el algoritmo
 */
function aplicarCierreAjustes() {
    $.ajax({
        url: '../../Controlador/Intermediarios/Baja/ObtenerDatosCierreAjus.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ estadoP: 'Abierto' }), 
        dataType: 'json',
        success: function(respuesta) {
            console.log("Respuesta del Intermediario:", respuesta);

            if (respuesta.estado === 'OK') {
                let AlumnosEnBaja = 0;
                let AlumnosEnTemp = 0;
                let AlumnosEnDef = 0;

                if (respuesta.filasAlumnos > 0) {
                    respuesta.datosAlumnos.forEach(alumno => {
                        if (alumno.estado === 'Baja') AlumnosEnBaja++;
                        else if (alumno.estado === 'Baja Temporal') AlumnosEnTemp++;
                        else if (alumno.estado === 'Baja Definitiva') AlumnosEnDef++;
                    });
                }

                // Aquí construimos el modal con los datos reales
                let modalHTML = `
                <div class="modal fade" id="confirmCierreAjustesModal" tabindex="-1" aria-labelledby="modalConfirmacionBajaLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title" id="modalConfirmacionBajaLabel">
                                    <i class="fas fa-exclamation-circle me-2"></i>Confirmar Cierre de Ajustes
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p class="mb-3">¿Está seguro de que desea aplicar el cierre de ajustes?</p>
                                <div class="alert alert-info mb-3">
                                    <p class="mb-1"><strong>Periodo:</strong> <span id="modalPeriodo">${respuesta.periodo}</span></p>
                                    <p class="mb-1"><strong>Total de alumnos en baja:</strong> <span id="modalTotal">${AlumnosEnBaja}</span></p>
                                    <p class="mb-1"><strong>Bajas temporales:</strong> <span id="modalTemporal">${AlumnosEnTemp}</span></p>
                                    <p class="mb-0"><strong>Bajas definitivas:</strong> <span id="modalDefinitiva">${AlumnosEnDef}</span></p>
                                </div>
                                <div class="alert alert-warning mb-3">
                                    <p class="mb-2"><strong>Esta acción realizará lo siguiente:</strong></p>
                                    <ul class="mb-0 ps-3">
                                        <li>Se aplicarán las bajas correspondientes</li>
                                        <li>Se generarán las calificaciones para su captura</li>
                                        <li><strong>Se cerrarán las modificaciones y ya no se podrán realizar cambios</strong></li>
                                    </ul>
                                </div>
                                <p class="text-danger mb-0">
                                    <i class="fas fa-exclamation-triangle me-2"></i>
                                    <strong>ADVERTENCIA:</strong> Esta acción tendrá consecuencias una vez ejecutada, el periodo de ajustes habrá terminado.
                                </p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="fas fa-times me-2"></i>Cancelar
                                </button>
                                <button type="button" class="btn btn-danger" id="btnConfirmarCierre">
                                    <i class="fas fa-check me-2"></i>Confirmar y Ejecutar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                `;

                // Remover modal anterior
                document.getElementById("confirmCierreAjustesModal")?.remove();

                // Insertar nuevo modal
                document.body.insertAdjacentHTML("beforeend", modalHTML);

                // Mostrar modal
                let modalElement = document.getElementById("confirmCierreAjustesModal");
                let modal = new bootstrap.Modal(modalElement);
                modal.show();

                // Botón confirmar
                document.getElementById("btnConfirmarCierre").addEventListener("click", function () {
                    modal.hide();
                    ejecutarBajaAutomatica();
                });

                // Eliminar del DOM al cerrar
                modalElement.addEventListener("hidden.bs.modal", function () {
                    modalElement.remove();
                });

            } else {
                console.error("No se pudieron obtener los alumnos filtrados o periodo.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error AJAX:", status, error);
        }
    });
}


// Función para cancelar y regresar
function cancelarBajaAutomatica() {
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
