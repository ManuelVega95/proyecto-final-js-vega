window.onload = () => {
  const ventaData = JSON.parse(localStorage.getItem("venta")) || [];
  const metodoPago = localStorage.getItem("metodoPago");
  const cuotas = localStorage.getItem("cuotas");
  if (ventaData.length > 0) {
    mostrarVenta(ventaData, metodoPago, cuotas);
  } else {
    document.getElementById("contenido-venta").innerHTML = "<p>No hay productos para mostrar.</p>";
  }
};

const mostrarVenta = (productos, metodoPago, cuotas) => {
  const contenedorVenta = document.getElementById("contenido-venta");
  contenedorVenta.innerHTML = "";

  productos.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Me pareció que queda mejor si ordeno alfabéticamente los productos.

  let total = 0;
  let totalOriginal = 0;
  let incremento = 0;

  productos.forEach(({ nombre = "", precio = 0, cantidad = 0, imagen = "", talle = ""}) => {
    const totalProducto = precio * cantidad;
    totalOriginal += totalProducto;
    total += totalProducto;
    // Card con los productos comprados con ciertos detalles
    const productoHTML = `
      <div class="producto-en-carrito">
        <img src="${imagen}" alt="${nombre}" class="producto-imagen">
        <h3>${nombre} (${talle})</h3>
        <span> PRECIO ORIGINAL: $${precio.toLocaleString('es-AR')}</span>
        <span> CANTIDAD: ${cantidad}</span>
        <p class="total-producto-carrito"> TOTAL PRODUCTO: $${totalProducto.toLocaleString('es-AR')}</p>
      </div>
    `;
    contenedorVenta.innerHTML += productoHTML;
  });

  if (metodoPago === "tarjeta") {
    // Mostrar subtotal SIN incremento
    const totalOriginalHTML = `
      <div class="total-carrito-tarjeta">
        <h3>Subtotal: $${totalOriginal.toLocaleString('es-AR')}</h3>
      </div>
    `;
    contenedorVenta.innerHTML += totalOriginalHTML;

    // Se aclara la cantidad de cuotas si se paga con tarjeta
    if (metodoPago === "tarjeta") {
      const cuotasHTML = ` 
      <div class="aclaracion-pago">
          <p><strong>Cuotas sin interés:</strong> ${cuotas} cuota(s)</p>
      </div>`;
      contenedorVenta.innerHTML += cuotasHTML;
  } else {
      // Si el pago es en efectivo, no se muestran
      const cuotasHTML = `
      <div class="aclaracion-pago">
          <p><strong>Pago en efectivo</strong></p>
      </div>`;
      contenedorVenta.innerHTML += cuotasHTML;
  }

    // Se aclara el aumento del 5% si se paga con tarjeta
    const aclaracionHTML = `
      <div class="aclaracion-pago">
        <p><strong>Aclaración:</strong> El total incluye un aumento del 5% por el pago con tarjeta.</p>
      </div>
    `;
    contenedorVenta.innerHTML += aclaracionHTML;

    // Se le aplica el incremento del 5% sólo para el pago con tarjeta
    incremento = totalOriginal * 0.05;
    total += incremento;

    // Total a pagar
    const totalConIncrementoHTML = `
      <div class="total-carrito">
        <h3>Total: $${total.toLocaleString('es-AR')}</h3>
      </div>
    `;
    contenedorVenta.innerHTML += totalConIncrementoHTML;


  } else {
    // Si el pago es en efectivo, sólo se muestra el total original
    const totalHTML = `
      <div class="total-carrito">
        <h3>Total: $${totalOriginal.toLocaleString('es-AR')}</h3>
      </div>
    `;
    contenedorVenta.innerHTML += totalHTML;
  }
};