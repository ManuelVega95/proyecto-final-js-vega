document.getElementById("formCompra").addEventListener("submit", function (event) {
    event.preventDefault();
    try {
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const telefono = document.getElementById("telefono").value;
        const metodoPago = document.getElementById("metodoPago").value;
        const email = document.getElementById("email").value;

        if (!nombre || !apellido || !telefono || !metodoPago) {
            throw new Error('Por favor, completá todos los campos obligatorios.');
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
            pagoTarjeta = "\nEste monto incluye un 5% adicional por pago con tarjeta.";
        }

        localStorage.setItem("metodoPago", metodoPago);
        localStorage.setItem("venta", JSON.stringify(carrito));

        Swal.fire({
            icon: 'success',
            title: 'Compra Confirmada',
            text: `¡Muchas gracias por tu compra, ${nombre}! 
                   Total a pagar: $${total.toLocaleString('es-AR')}.${pagoTarjeta}
                   Te enviaremos el detalle de la compra al email: ${email || 'No solicitado'}.`,
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