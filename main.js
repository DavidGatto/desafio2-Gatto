const fs = require("fs");

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  // Metodo para agregar un producto
  async addProduct(newObj) {
    let { title, description, price, thumbnail, code, stock } = newObj;

    // Verificamos si todos los campos estan completos
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Por favor, completa todos los campos");
      return;
    }

    // Verificamos si el codigo del producto es unico
    if (this.products.some((item) => item.code === code)) {
      console.log("El código debe ser único");
      return;
    }

    // Creamos un nuevo producto con un id unico
    const newProduct = {
      id: ++ProductManager.ultId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(newProduct);

    // Guardamos el array en el archivo
    await this.saveToFile(this.products);
  }

  getProducts() {
    console.log(this.products);
  }

  // Obtenemos un producto por su id
  async getProductById(id) {
    try {
      const productsArray = await this.readFile();
      const found = productsArray.find((item) => item.id === id);
      if (!found) {
        console.log("Producto no encontrado");
      } else {
        console.log("Producto encontrado");
        return found;
      }
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  // Leemos el archivo y devolvemos el array
  async readFile() {
    try {
      const response = fs.readFileSync(this.path, "utf-8");
      const productsArray = JSON.parse(response);
      return productsArray;
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  // Guardamos el array de productos en el archivo
  async saveToFile(productsArray) {
    try {
      fs.writeFileSync(this.path, JSON.stringify(productsArray, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }

  // Actualizamos un producto por su id
  async updateProduct(id, updatedProduct) {
    try {
      const productsArray = await this.readFile();

      const index = productsArray.findIndex((item) => item.id === id);
      if (index !== -1) {
        productsArray.splice(index, 1, updatedProduct);
        await this.saveToFile(productsArray);
      } else {
        console.log("No se ha podido actualizar el producto");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }

  // Eliminamos un producto por su id
  async deleteProductById(id) {
    try {
      let productsArray = await this.readFile();

      const index = productsArray.findIndex((item) => item.id === id);
      if (index !== -1) {
        productsArray.splice(index, 1);
        await this.saveToFile(productsArray);
        console.log("Producto eliminado correctamente");
      } else {
        console.log("No se ha podido encontrar el producto para eliminar");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }
}

// Testing

const manager = new ProductManager("./products.json");

manager.getProducts();

const computadora = {
  title: "Computadora de Escritorio",
  description: "Potente computadora para tareas intensivas",
  price: 3000,
  thumbnail: "imagen.png",
  code: "pc789",
  stock: 5,
};

manager.addProduct(computadora);

const teclado = {
  title: "Teclado Mecánico",
  description:
    "Teclado resistente y duradero para una experiencia de escritura cómoda",
  price: 100,
  thumbnail: "imagen.png",
  code: "kbd123",
  stock: 10,
};

manager.addProduct(teclado);

const teclado2 = {
  title: "Teclado Mecánico",
  description:
    "Teclado resistente y duradero para una experiencia de escritura cómoda",
  price: 100,
  thumbnail: "imagen.png",
  code: "kbd123",
};

manager.addProduct(teclado2);

const microfono = {
  title: "Microfono de Escritorio",
  description: "Potente microfono",
  price: 3000,
  thumbnail: "imagen.png",
  code: "mic123",
  stock: 51,
};

manager.addProduct(microfono);

manager.getProducts();

async function busquedaPorId() {
  const buscado = await manager.getProductById(2);
  console.log(buscado);
}
busquedaPorId();

async function testActualizarYEliminar() {
  const monitor = {
    id: 1,
    title: "Monitor para PC",
    description: "Super monitor para tu PC",
    price: 3000,
    thumbnail: "imagen.png",
    code: "pc789",
    stock: 5,
  };
  await manager.updateProduct(1, monitor);

  await manager.deleteProductById(3);
}

testActualizarYEliminar();
