let carrito = [];

export const agregarAlCarrito = (idProducto, talleSeleccionado, productos) => {
  try {
    let carritoStorage = JSON.parse(localStorage.getItem("carrito")) || [];
    const productoSeleccionado = productos.find(producto => producto.id === idProducto);
    
    if (productoSeleccionado) {
      const productoExistente = carritoStorage.find(producto => producto.id === idProducto && producto.talle === talleSeleccionado);
      
      if (productoExistente) {
        productoExistente.cantidad += 1;
      } else {
        carritoStorage.push({
          ...productoSeleccionado,
          talle: talleSeleccionado,
          cantidad: 1
        });
      }

      localStorage.setItem("carrito", JSON.stringify(carritoStorage));
      Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: `Agregaste "${productoSeleccionado.nombre} (${talleSeleccionado})" al carrito.`,
      });

      mostrarCarrito();
      Swal.fire({
        icon: 'success',
        title: 'Carrito actualizado',
        text: "Se actualizó el carrito.",
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Producto no encontrado.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Hubo un problema al agregar el producto al carrito. Por favor, intentalo nuevamente`,
    });
  }
};

export const mostrarCarrito = () => {
  try {
    const contenedorCarrito = document.getElementById("carrito");
    contenedorCarrito.innerHTML = "";
    
    const carritoStorage = JSON.parse(localStorage.getItem("carrito")) || [];

    let total = 0;

    if (carritoStorage.length > 0) {
      carritoStorage.forEach(({ id = 0, nombre = "", precio = 0, cantidad = 0, talle = [] }) => {
        
        const precioTotalProducto = precio * cantidad;

        total += precioTotalProducto;
        const cardHTML = `
        <div class="producto-en-carrito" id="producto-${id}-${talle}">
          <h3>${nombre}  (${talle})</h3>
          <span>PRECIO: $${precio.toLocaleString('es-AR')}</span>
          <span>CANTIDAD: ${cantidad}</span>
          <p class = "total-producto-carrito"> TOTAL PRODUCTO: $${precioTotalProducto.toLocaleString('es-AR')}</p>
          <button class="sumar-cantidad" data-id="${id}" data-talle="${talle}">+</button>
          <button class="eliminar" data-id="${id}" data-talle="${talle}">-</button>
          <button class="eliminar-todo" data-id="${id}" data-talle="${talle}" >Eliminar todos estos productos</button> 
        </div>
        `;
        contenedorCarrito.innerHTML += cardHTML;
      });

      const totalHTML = `
        <div class="total-carrito">
          <h3>Total: $${total.toLocaleString('es-AR')}</h3>
        </div>
      `;
      contenedorCarrito.innerHTML += totalHTML;

      crearBotonVaciarCarrito();

      const botonSumar = document.querySelectorAll(".sumar-cantidad");
      botonSumar.forEach(boton => {
        boton.addEventListener("click", (e) => {
          const idProducto = parseInt(e.target.getAttribute("data-id"));
          const talleSeleccionado = e.target.getAttribute("data-talle");
          sumarCantidad(idProducto, talleSeleccionado);
        });
      });

      const botonEliminar = document.querySelectorAll(".eliminar");
      botonEliminar.forEach(boton => {
        boton.addEventListener("click", (e) => {
          const idProducto = parseInt(e.target.getAttribute("data-id"));
          const talleSeleccionado = e.target.getAttribute("data-talle");
          eliminarDelCarrito(idProducto, talleSeleccionado);
        });
      });

      const botonEliminarTodo = document.querySelectorAll(".eliminar-todo");
      botonEliminarTodo.forEach(boton => {
        boton.addEventListener("click", (e) => {
          const idProducto = parseInt(e.target.getAttribute("data-id"));
          const talleSeleccionado =  e.target.getAttribute("data-talle");
          eliminarTodoDelCarrito(idProducto, talleSeleccionado);
        });
      });

      const botonVaciarCarrito = document.querySelector(".vaciar-carrito");
      if (botonVaciarCarrito) {
        botonVaciarCarrito.addEventListener("click", vaciarCarrito);
      }

    } else {
      contenedorCarrito.innerHTML = "<p>El carrito está vacío</p>";
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al mostrar el carrito',
      text: `Hubo un problema al mostrar el carrito. Por favor, intentalo nuevamente`,
    });
  }
};

const crearBotonVaciarCarrito = () => {
  const contenedorCarrito = document.getElementById("carrito");
  const botonVaciarHTML = `
    <button class="vaciar-carrito">Vaciar todo el carrito</button>
  `;
  contenedorCarrito.innerHTML += botonVaciarHTML;
};

const sumarCantidad = (idProducto, talleSeleccionado) => {
  try {
    let carritoStorage = JSON.parse(localStorage.getItem("carrito")) || [];

    const producto = carritoStorage.find(producto => producto.id === idProducto && producto.talle === talleSeleccionado);
    
    if (producto) {
      producto.cantidad += 1;
      
      localStorage.setItem("carrito", JSON.stringify(carritoStorage));
      mostrarCarrito();
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Hubo un problema al intentar agregar más unidades de este producto al carrito. Por favor, intentalo nuevamente.`,
    });
  }
};

const eliminarDelCarrito = (idProducto, talleSeleccionado) => {
  try {
    let carritoStorage = JSON.parse(localStorage.getItem("carrito")) || [];

    const producto = carritoStorage.find(producto => producto.id === idProducto && producto.talle === talleSeleccionado);

    if (producto) {
      if (producto.cantidad > 1) {
        producto.cantidad -= 1;
      } else {
        carritoStorage = carritoStorage.filter(producto => !(producto.id === idProducto && producto.talle === talleSeleccionado));
      }
      localStorage.setItem("carrito", JSON.stringify(carritoStorage));
      mostrarCarrito();
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Hubo un problema al intentar eliminar una cantidad de este producto del carrito. Por favor, intentalo nuevamente`,
    });
  }
};

const eliminarTodoDelCarrito = (idProducto, talleSeleccionado) => {
  try {
    let carritoStorage = JSON.parse(localStorage.getItem("carrito")) || [];
    const productosEliminados = carritoStorage.filter(producto => producto.id === idProducto && producto.talle === talleSeleccionado);

    carritoStorage = carritoStorage.filter(producto => !(producto.id === idProducto && producto.talle === talleSeleccionado));
    
    localStorage.setItem("carrito", JSON.stringify(carritoStorage));
    if (productosEliminados.length > 0) {
      const nombresProductos = productosEliminados.map(producto => `${producto.nombre} (${producto.talle})`).join(", ");
      Swal.fire({
        icon: 'info',
        title: 'Atención',
        text: `Se eliminaron del carrito todos los talles del producto: ${nombresProductos}`,
      });
      mostrarCarrito();
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al eliminar productos',
      text: `Hubo un problema al eliminar los mismos productos del carrito. Por favor, intentalo nuevamente`,
    });
  }
};

const vaciarCarrito = () => {
  try {
    localStorage.removeItem("carrito");

    Swal.fire({
      icon: 'info',
      title: 'Atención',
      text: `Se eliminaron todos los productos del carrito`,
    });
    mostrarCarrito();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al vaciar el carrito',
      text: `Hubo un problema al vaciar el carrito. Por favor, intentalo nuevamente`,
    });
  }
};

const confirmarCompra = document.getElementById("confirmar-compra");
if (confirmarCompra) {
    confirmarCompra.addEventListener("click", () => {
        const carritoStorage = JSON.parse(localStorage.getItem("carrito")) || [];

        if (carritoStorage.length > 0) {
            window.location.href = "../pages/compra.html";
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Carrito vacío',
                text: "Agregá por lo menos un producto.",
            });
        }
    });
}

window.onload = () => mostrarCarrito();