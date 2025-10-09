// Datos de ejemplo para simular la respuesta del backend
const datosEjemplo = {
    'ENE-JUN-2024': {
        periodo: 'ENE-JUN-2024',
        fechaCierre: '15/01/2024',
        estado: 'Cerrado',
        aplicado: false,
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
            }
        ]
    },
    'AGO-DIC-2024': {
        periodo: 'AGO-DIC-2024',
        fechaCierre: '15/08/2024',
        estado: 'Cerrado',
        aplicado: false,
        alumnos: [
            {
                noControl: '20400991',
                nombre: 'Pérez Martínez Roberto Carlos',
                carrera: 'Ing. Informática',
                bajasPrevias: 0,
                tipoBaja: 'Temporal'
            },
            {
                noControl: '20401023',
                nombre: 'Torres Sánchez Laura Patricia',
                carrera: 'Ing. Industrial',
                bajasPrevias: 2,
                tipoBaja: 'Temporal'
            },
            {
                noControl: '20401145',
                nombre: 'Morales Ruiz Francisco Javier',
                carrera: 'Ing. Sistemas',
                bajasPrevias: 1,
                tipoBaja: 'Temporal'
            },
            {
                noControl: '20401267',
                nombre: 'Cruz Hernández Daniela Sofía',
                carrera: 'Ing. Gestión',
                bajasPrevias: 3,
                tipoBaja: 'Definitiva'
            },
            {
                noControl: '20401389',
                nombre: 'Vega Castillo Miguel Ángel',
                carrera: 'Ing. Informática',
                bajasPrevias: 0,
                tipoBaja: 'Temporal'
            }
        ]
    },
    'ENE-JUN-2025': {
        periodo: 'ENE-JUN-2025',
        fechaCierre: '15/01/2025',
        estado: 'Cerrado',
        aplicado: false,
        alumnos: [
            {
                noControl: '20401401',
                nombre: 'Reyes Gómez Andrea Lucía',
                carrera: 'Ing. Industrial',
                bajasPrevias: 1,
                tipoBaja: 'Temporal'
            },
            {
                noControl: '20401523',
                nombre: 'Mendoza Silva Carlos Eduardo',
                carrera: 'Ing. Sistemas',
                bajasPrevias: 0,
                tipoBaja: 'Temporal'
            },
            {
                noControl: '20401645',
                nombre: 'Jiménez Vargas Paola Alejandra',
                carrera: 'Ing. Informática',
                bajasPrevias: 2,
                tipoBaja: 'Temporal'
            },
            {
                noControl: '20401767',
                nombre: 'Castro López Fernando Gabriel',
                carrera: 'Ing. Gestión',
                bajasPrevias: 3,
                tipoBaja: 'Definitiva'
            },
            {
                noControl: '20401889',
                nombre: 'Ortiz Medina Mariana Isabel',
                carrera: 'Ing. Industrial',
                bajasPrevias: 0,
                tipoBaja: 'Temporal'
            },
            {
                noControl: '20401912',
                nombre: 'Navarro Torres Ricardo Daniel',
                carrera: 'Ing. Sistemas',
                bajasPrevias: 1,
                tipoBaja: 'Temporal'
            }
        ]
    }
};

// Función para cargar el resumen de bajas al seleccionar un periodo
function cargarResumenBaja() {
    const selectPeriodo = document.getElementById('listaPeriodos');
    const periodoSeleccionado = selectPeriodo.value;

    if (!periodoSeleccionado) {
        ocultarSecciones();
        return;
    }

    // Obtener datos del periodo seleccionado
    const datosPeriodo = datosEjemplo[periodoSeleccionado];

    if (!datosPeriodo) {
        console.error('No se encontraron datos para el periodo seleccionado');
        return;
    }

    // Mostrar información del periodo
    mostrarInformacionPeriodo(datosPeriodo);

    // Cargar resumen y tabla
    cargarTablaAlumnos(datosPeriodo.alumnos);
    actualizarResumen(datosPeriodo.alumnos);

    // Mostrar secciones
    document.getElementById('infoPeriodo').style.display = 'block';
    document.getElementById('resumenBaja').style.display = 'block';
    document.getElementById('botonesAccion').style.display = 'block';
}

// Función para mostrar información del periodo
function mostrarInformacionPeriodo(datos) {
    document.getElementById('periodoSeleccionado').textContent = datos.periodo;
    document.getElementById('fechaCierre').textContent = datos.fechaCierre;
}

// Función para cargar la tabla de alumnos
function cargarTablaAlumnos(alumnos) {
    const tbody = document.getElementById('tablaAlumnosBajaBody');
    tbody.innerHTML = '';

    alumnos.forEach(alumno => {
        const badgeBajas = alumno.bajasPrevias >= 3 ? 'bg-danger' : 'bg-info';
        const badgeTipo = alumno.tipoBaja === 'Definitiva' ? 'bg-danger' : 'bg-warning';

        const row = `
            <tr>
                <td>${alumno.noControl}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.carrera}</td>
                <td><span class="badge ${badgeBajas}">${alumno.bajasPrevias}</span></td>
                <td><span class="badge ${badgeTipo}">${alumno.tipoBaja}</span></td>
            </tr>
        `;
        tbody.innerHTML += row;
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

// Función para ocultar todas las secciones
function ocultarSecciones() {
    document.getElementById('infoPeriodo').style.display = 'none';
    document.getElementById('resumenBaja').style.display = 'none';
    document.getElementById('botonesAccion').style.display = 'none';
}

// Función para confirmar la baja automática (abre el modal)
function confirmarBajaAutomatica() {
    const periodoSeleccionado = document.getElementById('listaPeriodos').value;
    const total = document.getElementById('totalAlumnos').textContent;
    const temporal = document.getElementById('bajasTemporal').textContent;
    const definitiva = document.getElementById('bajasDefinitiva').textContent;

    // Actualizar datos del modal
    document.getElementById('modalPeriodo').textContent = periodoSeleccionado;
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

    // Aquí se conectaría con el backend para ejecutar la baja
    // Por ahora solo mostramos un mensaje de éxito

    // Simular proceso de ejecución
    const btnEjecutar = document.getElementById('btnEjecutarBaja');
    btnEjecutar.disabled = true;
    btnEjecutar.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Procesando...';

    mostrarDatosGuardados('Baja automática ejecutada exitosamente.\n\nSe aplicó la baja a ' +
        document.getElementById('totalAlumnos').textContent + ' alumnos.', function () {
        cancelarBajaAutomatica();
    });
}

// Función para cancelar y regresar
function cancelarBajaAutomatica() {
    // Resetear el select
    document.getElementById('listaPeriodos').value = '';

    // Ocultar secciones
    ocultarSecciones();

    // Limpiar tabla
    const tbody = document.getElementById('tablaAlumnosBajaBody');
    tbody.innerHTML = '';

    // Resetear contadores
    document.getElementById('totalAlumnos').textContent = '0';
    document.getElementById('bajasTemporal').textContent = '0';
    document.getElementById('bajasDefinitiva').textContent = '0';

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
});

