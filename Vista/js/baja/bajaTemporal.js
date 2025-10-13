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
    document.getElementById('periodoSeleccionado').textContent = periodoActivo.periodo;
    document.getElementById('fechaInicio').textContent = periodoActivo.fechaInicio;
    document.getElementById('fechaCierre').textContent = periodoActivo.fechaCierre;

    // Cargar tabla y resumen
    cargarTablaAlumnos(periodoActivo.alumnos);
    actualizarResumen(periodoActivo.alumnos);
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

// Función para confirmar la baja automática (abre el modal)
function confirmarBajaAutomatica() {
    const total = document.getElementById('totalAlumnos').textContent;
    const temporal = document.getElementById('bajasTemporal').textContent;
    const definitiva = document.getElementById('bajasDefinitiva').textContent;

    // Actualizar datos del modal
    document.getElementById('modalPeriodo').textContent = periodoActivo.periodo;
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

    setTimeout(function () {
        mostrarDatosGuardados('Baja automática ejecutada exitosamente.\n\nSe aplicó la baja a ' +
            document.getElementById('totalAlumnos').textContent + ' alumnos del periodo ' + periodoActivo.periodo, function () {
            cancelarBajaAutomatica();
        });
    }, 500);
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
