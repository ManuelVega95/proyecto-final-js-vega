document.getElementById("metodoPago").addEventListener("change", function() {
    const metodoPago = this.value;
    const formPagoTarjeta = document.getElementById("formPagoTarjeta");
    // Mostrar campos de tarjeta SÓLO si se selecciona "tarjeta" (método de pago, y cuotas)
    if (metodoPago === "tarjeta") {
        formPagoTarjeta.style.display = "block";
    } else {
        formPagoTarjeta.style.display = "none";
    }
});


document.getElementById("formCompra").addEventListener("submit", function (event) { 
    event.preventDefault();
    try {// Todos los puntos son obligatorios, a excepción de la dirección
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const telefono = document.getElementById("telefono").value;
        const email = document.getElementById("email").value;
        const metodoPago = document.getElementById("metodoPago").value;
        const numeroTarjeta = document.getElementById("numeroTarjeta").value;
        const cuotas = document.getElementById("cuotas").value;
        const terminos = document.getElementById("terminos").checked;

        if (!nombre || !apellido || !telefono || !email || !metodoPago || !numeroTarjeta|| !cuotas) {
            Swal.fire({ // si faltan alguno de estos datos
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completá todos los campos obligatorios.',
            });
            return;
        }
        if (!terminos) {// Si falta sólo rellenar los términos y condiciones
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, aceptá los términos y condiciones para continuar con tu compra.',
            });
            return;
        }

        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let total = 0;

        carrito.forEach(({ precio, cantidad }) => {
            total += precio * cantidad;
        });

        // Se agrega un 5% extra al monto total si se paga con tarjeta
        let pagoTarjeta = "";
        if (metodoPago === "tarjeta") {
            total *= 1.05;
            pagoTarjeta = "\nEste monto incluye un 5% adicional por pago con tarjeta";
        }

        localStorage.setItem("metodoPago", metodoPago);
        localStorage.setItem("cuotas", cuotas);
        localStorage.setItem("venta", JSON.stringify(carrito));

        Swal.fire({
            icon: 'success',
            title: 'Compra Confirmada',
            text: `¡Muchas gracias por tu compra, ${nombre}! 
                   Total a pagar: $${total.toLocaleString('es-AR')}${pagoTarjeta}, en ${cuotas} cuota(s) sin interés.
                   Te enviaremos el detalle de la compra al email: ${email}.`,
        }).then(() => {
            localStorage.removeItem("carrito");
            localStorage.setItem("venta", JSON.stringify(carrito));
            window.location.href = "../pages/venta.html";
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Hubo un problema al procesar la compra. Por favor, intentá nuevamente.',
        });
    }
});