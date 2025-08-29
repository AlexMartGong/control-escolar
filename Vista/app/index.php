<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema Escolar - TecJalisco</title>
    <!-- CSS de Select2 -->
    <link rel="stylesheet" href="../select2/select2.min.css">
    <!-- DataTables + Bootstrap 5 CSS -->
    <link rel="stylesheet" href="../DataTables/css/dataTables.bootstrap5.css">
    <!-- DataTables Responsive + Bootstrap 5 CSS -->
    <link rel="stylesheet" href="../DataTables/css/responsive.bootstrap5.css">
    <!-- para cambiar el icono de DataTables -->
    <link rel="stylesheet" href="../css/iconsDatatable.css">
    <!-- Bootstrap CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- DataTables CSS -->
    <link href="https://cdn.datatables.net/1.13.5/css/jquery.dataTables.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="../css/style.css" rel="stylesheet">
    <!-- jQuery UI CSS - needed for datepicker -->
    <link href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css" rel="stylesheet">
</head>
<body>
<!-- Botón de menú para móvil -->
<button class="menu-toggle d-lg-none" id="menuToggle">
    <i class="fas fa-bars"></i>
</button>

<div class="container-fluid">
    <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 px-0 sidebar" id="sidebar">
            <div class="logo">
                <a href="index.php"> <img src="../img/logo-tecmm.png" alt="TecJalisco Logo" class="img-fluid"></a>
            </div>

            <!-- Menú Datos -->
            <div class="nav flex-column">
                <h5 class="section-title">
                    <i class="fas fa-database me-2"></i>Datos
                </h5>
                <div class="submenu">
                    <!-- Enlaces directos sin submenús -->
                    <a href="javascript:void(0);" onclick="option('student', '');" class="nav-link"><i
                                class="fas fa-user-graduate me-2"></i>Alumnos</a>
                    <a href="javascript:void(0);" onclick="option('carrera', '');" class="nav-link"><i
                                class="fas fa-graduation-cap me-2"></i>Carrera</a>
                    <a href="javascript:void(0);" onclick="option('docente', '');" class="nav-link"><i
                                class="fas fa-chalkboard-teacher me-2"></i>Docente</a>
                    <a href="javascript:void(0);" onclick="option('materia', '');" class="nav-link"><i
                                class="fas fa-book me-2"></i>Materias</a>
                    <a href="javascript:void(0);" onclick="option('career-manager', '')" class="nav-link"><i
                                class="fas fa-user-tie me-2"></i>Jefe de
                        Carrera</a>
                </div>
            </div>

            <!-- Menú Configuraciones -->
            <div class="nav flex-column">
                <h5 class="section-title">
                    <i class="fas fa-cog me-2"></i>Configuraciones
                </h5>
                <div class="submenu">
                    <!-- Enlaces directos sin submenús -->
                    <a href="javascript:void(0);" onclick="option('period', '');" class="nav-link"><i
                                class="fas fa-calendar me-2"></i>Periodo</a>
                    <a href="javascript:void(0);" class="nav-link"><i class="fas fa-tasks me-2"></i>Parcial</a>
                </div>
            </div>

            <!-- Menú Operaciones -->
            <div class="nav flex-column">
                <h5 class="section-title">
                    <i class="fas fa-cogs me-2"></i>Operaciones
                </h5>
                <div class="submenu">
                    <!-- Enlaces directos sin submenús -->
                    <a href="javascript:void(0);" onclick="option('oferta', '')" class="nav-link"><i
                                class="fas fa-clipboard-list me-2"></i>Oferta</a>
                    <a href="javascript:void(0);" class="nav-link"><i class="fas fa-edit me-2"></i>Captura</a>
                    <a href="javascript:void(0);" onclick="option('horario', '')" class="nav-link"><i class="fas fa-clock me-2"></i>Horario</a>
                    <a href="javascript:void(0);" class="nav-link"><i class="fas fa-user-minus me-2"></i>Baja</a>
                </div>
            </div>
        </div>

        <!-- Contenido principal -->
        <div class="col-md-9 col-lg-10 ms-auto p-4">
            <div id="mainContent" class="p-3 rounded text-center">
                <!-- El contenido se cargará aquí dinámicamente -->
                <h2 class="my-4">Bienvenido al sistema</h2>
            </div>
        </div>
    </div>
</div>

<!-- jQuery  -->
<script src="../DataTables/js/jquery-3.7.1.js"></script>

<!-- jQuery UI  -->
<script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"></script>

<!-- Bootstrap 5 JS Bundle -->
<script src="../DataTables/js/bootstrap.bundle.min.js"></script>

<!-- DataTables núcleo -->
<script src="../DataTables/js/dataTables.js"></script>

<!-- DataTables integración con Bootstrap 5 -->
<script src="../DataTables/js/dataTables.bootstrap5.js"></script>

<!-- DataTables extensión Responsive -->
<script src="../DataTables/js/dataTables.responsive.js"></script>
<script src="../DataTables/js/responsive.bootstrap5.js"></script>
<!-- JS de Select2 -->
<script src="../select2/select2.min.js"></script>

<!-- Scripts personalizados (después de librerías) -->
<script src="../js/function.js"></script>
<script src="../js/periodo/function_period.js"></script>
<script src="../js/jefe_carrera/funciones.js"></script>
<script src="../js/docente/docente.js"></script>
<script src="../js/carrerajs/carrera.js"></script>
<script src="../js/materia/materia.js"></script>
<script src="../js/funcionesGlobales.js"></script>
<script src="../js/oferta/oferta.js"></script>
<script src="../js/alumno/alumno.js"></script>
<script src="../js/horario/horario.js"></script>
<script src="../js/horario/horarioIndividual.js"></script>
</body>
</html>
