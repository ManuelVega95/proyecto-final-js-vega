let carrito = [];

// Agregar los productos al carrito
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
      Toastify({
        text: `Agregaste "${productoSeleccionado.nombre} (${talleSeleccionado})" al carrito.`,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #4caf50, #8bc34a)",
        },
        stopOnFocus: true,
      }).showToast();

      mostrarCarrito();
    }
  } catch (error) {
    Toastify({
      text: `No se pudo agregar el producto al carrito. Por favor, intentalo nuevamente.`,
      duration: 2000,
      close: true,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff4747, #f44336)",
      },
      stopOnFocus: true,
  }).showToast();
  }
};

// Mostrar los productos del carrito
export const mostrarCarrito = () => {
  try {
    const contenedorCarrito = document.getElementById("carrito");
    contenedorCarrito.innerHTML = "";
    
    const carritoStorage = JSON.parse(localStorage.getItem("carrito")) || [];

    let total = 0;
    // Card con los productos en el carrito
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
      // Llamar al botón para sumar una cantidad de un mismo producto en el carrito (dependiendo del talle)
      const botonSumar = document.querySelectorAll(".sumar-cantidad");
      botonSumar.forEach(boton => {
        boton.addEventListener("click", (e) => {
          const idProducto = parseInt(e.target.getAttribute("data-id"));
          const talleSeleccionado = e.target.getAttribute("data-talle");
          sumarCantidad(idProducto, talleSeleccionado);
        });
      });
      // Llamar al botón para eliminar una cantidad de un mismo producto en el carrito (dependiendo del talle)
      const botonEliminar = document.querySelectorAll(".eliminar");
      botonEliminar.forEach(boton => {
        boton.addEventListener("click", (e) => {
          const idProducto = parseInt(e.target.getAttribute("data-id"));
          const talleSeleccionado = e.target.getAttribute("data-talle");
          eliminarDelCarrito(idProducto, talleSeleccionado);
        });
      });
      // Llamar al botón para eliminar todos los productos de cierto talle en el carrito
      const botonEliminarTodo = document.querySelectorAll(".eliminar-todo");
      botonEliminarTodo.forEach(boton => {
        boton.addEventListener("click", (e) => {
          const idProducto = parseInt(e.target.getAttribute("data-id"));
          const talleSeleccionado =  e.target.getAttribute("data-talle");
          eliminarTodoDelCarrito(idProducto, talleSeleccionado);
        });
      });
      // Llamar al botón para vaciar el carrito
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
// Crear el botón para vaciar el carrito
const crearBotonVaciarCarrito = () => {
  const contenedorCarrito = document.getElementById("carrito");
  const botonVaciarHTML = `
    <button class="vaciar-carrito">Vaciar todo el carrito</button>
  `;
  contenedorCarrito.innerHTML += botonVaciarHTML;
};
// Crear el botón para sumar una cantidad de un producto en el carrito (dependiendo del talle)
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
// Crear el botón para eliminar una cantidad de un producto del carrito (dependiendo del talle)
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
// Crear el botón para eliminar completamente un producto del carrito (dependiendo del talle)
const eliminarTodoDelCarrito = (idProducto, talleSeleccionado) => {
  try {
    let carritoStorage = JSON.parse(localStorage.getItem("carrito")) || [];
    const productosEliminados = carritoStorage.filter(producto => producto.id === idProducto && producto.talle === talleSeleccionado);

    carritoStorage = carritoStorage.filter(producto => !(producto.id === idProducto && producto.talle === talleSeleccionado));
    
    localStorage.setItem("carrito", JSON.stringify(carritoStorage));
    if (productosEliminados.length > 0) {
      const nombresProductos = productosEliminados.map(producto => `${producto.nombre} (${producto.talle})`).join(", ");
      Toastify({
        text: `Se eliminaron del carrito todos los talles del producto: ${nombresProductos}`,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #4caf50, #8bc34a)",
        },
        stopOnFocus: true,
      }).showToast();
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

let carritoAnterior = []; // Array con el carrito anterior para poder retomar el carrito en caso de no querer vaciarlo
// Crear el botón para vaciar completamente el carrito
const vaciarCarrito = () => {
  try {
    carritoAnterior = JSON.parse(localStorage.getItem("carrito")) || [];
    localStorage.removeItem("carrito");
    // Dar la posibilidad de de vaciar todo el carrito por si fue un error
    Swal.fire({
      icon: 'info',
      title: 'Atención',
      text: 'Se eliminarán todos los productos del carrito',
      showCancelButton: true,
      confirmButtonText: 'Deshacer',
      cancelButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("carrito", JSON.stringify(carritoAnterior));
        mostrarCarrito();
      } else {
        Toastify({
          text: `Se eliminaron todos los productos del carrito.`,
          duration: 2000,
          close: true,
          gravity: "top",
          position: "right",
          style: {
            background: "linear-gradient(to right, #4caf50, #8bc34a)",
          },
          stopOnFocus: true,
        }).showToast();
        mostrarCarrito();
      }
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al vaciar el carrito',
      text: 'Hubo un problema al vaciar el carrito. Por favor, intentalo nuevamente',
    });
  }
};
// Crear el botón para confirmar la compra
const confirmarCompra = document.getElementById("confirmar-compra");
if (confirmarCompra) {
    confirmarCompra.addEventListener("click", () => {
        const carritoStorage = JSON.parse(localStorage.getItem("carrito")) || [];

        if (carritoStorage.length > 0) {
            window.location.href = "pages/compra.html";
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Carrito vacío',
                text: "Agregá por lo menos un producto.",
            });
        }
    });
}

window.onload = () => mostrarCarrito(); // Llamar para mostrar el carrito completamente