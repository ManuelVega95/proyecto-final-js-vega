window.onload = () => {
  const ventaData = JSON.parse(localStorage.getItem("venta")) || [];
  const metodoPago = localStorage.getItem("metodoPago");
  if (ventaData.length > 0) {
    mostrarVenta(ventaData, metodoPago);
  } else {
      document.getElementById("contenido-venta").innerHTML = "<p>No hay productos para mostrar.</p>";
  }
};

const mostrarVenta = (productos, metodoPago) => {
  const contenedorVenta = document.getElementById("contenido-venta");
  contenedorVenta.innerHTML = "";

  productos.sort((a, b) => a.nombre.localeCompare(b.nombre)); // queda mejor si se ordenan alfabéticamente todos los productos en el detalle, una vez finalizada la compra.

  let total = 0;
  let totalOriginal = 0;
  let incremento = 0;

  productos.forEach(({ nombre = "", precio = 0, cantidad = 0, imagen = "", talle = ""}) => {
    const totalProducto = precio * cantidad;
    totalOriginal += precio * cantidad;
    total += totalProducto;

    const productoHTML = `
      <div class="producto-en-carrito">
      <img src="${imagen}" alt="${nombre}" class="producto-imagen">
        <h3>${nombre} (${talle})</h3>
        <span> PRECIO ORIGINAL: $${precio.toLocaleString('es-AR')}</span>
        <span> CANTIDAD: ${cantidad}</span>
        <p class = "total-producto-carrito"> TOTAL PRODUCTO: $${totalProducto.toLocaleString('es-AR')}</p>
      </div>
    `;
    contenedorVenta.innerHTML += productoHTML;
  });

  if (metodoPago === "tarjeta") {
    incremento = totalOriginal * 0.05;
    total += incremento;
  }

  const totalHTML = `
    <div class="total-carrito">
      <h3>Total de la compra: $${total.toLocaleString('es-AR')}</h3>
    </div>
  `;
  contenedorVenta.innerHTML += totalHTML;

  if (metodoPago === "tarjeta") {
    const aclaracionHTML = `
      <div class="aclaracion-pago">
        <p><strong>Aclaración:</strong> El total incluye un aumento del 5% por el pago con tarjeta.</p>
      </div>
    `;
    contenedorVenta.innerHTML += aclaracionHTML;
  }
};