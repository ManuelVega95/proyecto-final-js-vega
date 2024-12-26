export class Producto {
  constructor(id = 0, nombre = "", descripcion = "", precio = 0, imagen = "", talles = "") {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.imagen = imagen;
    this.talles = talles;
  }
  mostrarProducto() {
    try {
      if (typeof this.precio !== 'number' || isNaN(this.precio)) {
        throw new Error("El precio no es un número válido");
      }
      return `Producto: ${this.nombre}, Precio: $${this.precio.toLocaleString('es-AR')}`;
    } catch (error) {
      return "Error al mostrar el producto";
    }
  }
}