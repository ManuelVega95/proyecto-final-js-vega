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

// Función para formatear el número de tarjeta
function formatCardNumber(cardNumber) {
    let digits = cardNumber.replace(/\D/g, '');
    if (digits.length > 16) { // V
        digits = digits.substring(0, 16);
    }
    // Agregar un espacio después de cada 4 dígitos para la tarjeta.
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}
// Función para validar sólo números en el teléfono
function validatePhoneNumber(phoneNumber) {
    return phoneNumber.replace(/\D/g, '');
}

// Evento para formatear el número de tarjeta mientras se escribe
document.getElementById("numeroTarjeta").addEventListener("input", function(event) {
    this.value = formatCardNumber(this.value);
});

// Asegurarse de que SÓLO se ingresen números en el teléfono
document.getElementById("telefono").addEventListener("input", function(event) {
    this.value = validatePhoneNumber(this.value); // Elimina cualquier cosa que no sea un número
});

document.getElementById("formCompra").addEventListener("submit", function (event) { 
    event.preventDefault();
    try {// Todos los puntos son obligatorios, a excepción de la dirección (Se simula como si fuera una compra que se retira en el negocio únicamente, sin envío)
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        let telefono = document.getElementById("telefono").value;
        const email = document.getElementById("email").value;
        const metodoPago = document.getElementById("metodoPago").value;
        let numeroTarjeta = metodoPago === "tarjeta" ? document.getElementById("numeroTarjeta").value : "";
        const cuotas = metodoPago === "tarjeta" ? document.getElementById("cuotas").value : "0";
        const terminos = document.getElementById("terminos").checked;

        telefono = validatePhoneNumber(telefono); // Necesito que el teléfono SÓLO tenga números

        if (!nombre || !apellido || !telefono || !email || (metodoPago === "tarjeta" && (!numeroTarjeta || !cuotas))) {
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

        // Formatear el número de tarjeta si es necesario
        if (metodoPago === "tarjeta") {
            numeroTarjeta = formatCardNumber(numeroTarjeta);
        }

        // Se muestra el error en caso de que el número de tarjeta tenga menos de 16 dígitos
        if (metodoPago === "tarjeta" && numeroTarjeta.replace(/\D/g, '').length !== 16) {
            Swal.fire({
                icon: 'warning',
                title: 'Número de tarjeta inválido',
                text: 'El número de tarjeta debe tener exactamente 16 dígitos.',
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
            pagoTarjeta = `\nEste monto incluye un 5% adicional por pago con tarjeta, en ${cuotas} cuota(s) sin interés`;
        }
        
        localStorage.setItem("metodoPago", metodoPago);
        localStorage.setItem("cuotas", cuotas);
        localStorage.setItem("venta", JSON.stringify(carrito));

        let mensaje = `¡Muchas gracias por tu compra, ${nombre}! 
                       Total a pagar: $${total.toLocaleString('es-AR')}${pagoTarjeta}. 
                       Te enviaremos el detalle de la compra al email: ${email}.`;

        if (metodoPago === "efectivo") { // Para que el mensaje varíe dependiendo de si uno compra con efectivo
            mensaje = `¡Muchas gracias por tu compra, ${nombre}!
                       Total a pagar: $${total.toLocaleString('es-AR')}.
                       Te enviaremos el detalle de la compra al email: ${email}.`;
        }
        Swal.fire({
            icon: 'success',
            title: 'Compra Confirmada',
            text: mensaje,
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