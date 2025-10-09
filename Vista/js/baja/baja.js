// Función que permite cargar el formulario de modificar baja
function loadFormBaja(opc, id = "") {
    let url = "";
    if (opc === "modBaja") {
        url = "baja/modBaja.html";
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
                        .fadeIn(500)
                        .promise()
                        .then(() => {
                            if (opc === "modBaja" && id !== "") {
                                // Cargar los datos de la baja usando la función de modBaja.js
                                cargarDatosBaja(id);
                                console.log("Cargando datos de baja con ID: " + id);
                            }
                        })
                        .catch((error) => {
                            console.error("Error durante la carga del formulario:", error);
                            mostrarErrorCaptura("Ocurrió un error al cargar los datos.");
                        });

                    // Animación secundaria (opcional)
                    container.css("transform", "translateY(-10px)").animate(
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
            mostrarErrorCaptura("Error de conexión: " + textStatus + " - " + errorThrown);
        });
    });
}
