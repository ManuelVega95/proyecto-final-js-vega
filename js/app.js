import { Producto } from './productos.js'; // importamos la clase Producto
import { agregarAlCarrito, mostrarCarrito } from './carrito.js'; // Traemos desde carrito, las funciones para agregar al carrito y mostrar el carrito

// Traer los productos desde JSON
const cargarProductos = async () => {
    try {
        const response = await fetch('../productos.json');
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Formato de datos inválido');
        }
        const productos = data.map(item => {
            if (!item.id || !item.nombre || !item.precio || !item.imagen) {
                throw new Error('Faltan datos en los productos');
            }
            return new Producto(item.id, item.nombre, item.descripcion, item.precio, item.imagen, item.talles);
        });
        mostrarProductos(productos);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Surgió un problema',
            text: `Error al cargar los productos: ${error.message}` // más allá de que durante la clase se explicó que el cartel debe ser atractivo para el usuario, este es un mensaje más para el programador, por eso lo mantengo acá y en el resto de los códigos que sean similares. 
        });
    }
};

// Mostrar los productos
const mostrarProductos = (productos) => { 
    try {
        const contenedorProductos = document.getElementById("productos");
        if (!contenedorProductos) {
            return;
        }
        contenedorProductos.innerHTML = '';
        if (!Array.isArray(productos) || productos.length === 0) {
            return;
        }
        productos.forEach(({ nombre = "", imagen = "", precio = 0, id = 0, talles = [] }) => {
            if (!nombre || !imagen || !precio || !id || !Array.isArray(talles)) {
                return;
            }
            const tallesHTML = talles.map(talle => {
                return `<option value="${talle}">${talle}</option>`;
            }).join("");

            // Traer las cards de los productos
            const cardHTML = `
                <div class="card">
                    <h2 class="card__productos">${nombre.toUpperCase()}</h2>
                    <hr class="bordeCard">
                    <div class="card__cajaImagen">
                        <img class="card__img" src="${imagen}" alt="${nombre}">
                        <p class="card__description">
                            <i class="bi bi-arrow-right-circle-fill"></i> 
                            <span class="bold">PRECIO: </span>
                            <span class="italic">$${precio.toLocaleString()}</span>
                        </p>
                        <select id="talle-${id}" class="talle-selector">
                            ${tallesHTML}
                        </select>
                        <button class="agregar-al-carrito" data-id="${id}">
                            <img src="../fotos/Logo-carrito.png" alt="Agregar al carrito" class="icono-carrito"> 
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            `;
            contenedorProductos.innerHTML += cardHTML;
        });

        const botonAgregarAlCarrito = document.querySelectorAll('.agregar-al-carrito');
        botonAgregarAlCarrito.forEach(boton => {
            boton.addEventListener('click', (e) => {
                try {
                    const idProducto = parseInt(e.target.getAttribute('data-id'));
                    const talleSeleccionado = document.getElementById(`talle-${idProducto}`).value;
                    const productoSeleccionado = productos.find(producto => producto.id === idProducto);
                    if (!productoSeleccionado) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: `Producto no encontrado.`,
                        });
                        return;
                    }
                    agregarAlCarrito(idProducto, talleSeleccionado, productos);
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `No se pudo agregar el producto al carrito. Por favor, intentalo nuevamente`,
                    });
                }
            });
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al mostrar los productos',
            text: `Hubo un problema al mostrar los productos: ${error.message}`,
        });
    }
};

const generarId = (productos) => {
    try {
        const maxId = productos.length > 0 ? Math.max(...productos.map(producto => producto.id)) : 0;
        return maxId + 1;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al generar el ID',
            text: `Hubo un problema al generar el ID del producto: ${error.message}`,
        });
    }
};
// Función para crear productos aunque no está en uso
const crearProducto = (producto = "", descripcion = "", precio = 0, imagen = "", talles = [], productos) => {
    try {
        const id = generarId(productos);
        const nuevoProducto = new Producto(id, producto, descripcion, precio, imagen, talles);
        productos.push(nuevoProducto);
        Swal.fire({
            icon: 'success',
            title: 'Producto Creado',
            text: `Se agregó: ${nuevoProducto.nombre}`,
        });
        mostrarProductos(productos);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al crear el producto',
            text: `Hubo un problema al crear el producto: ${error.message}`,
        });
    }
};

window.onload = async () => { // Traer los productos y el carrito a la página
    cargarProductos();
    mostrarCarrito();
};