const { products: exampleProducts } = require("../app_options");
module.exports.ProductsMySQLDB = class ProductsDB {
  #knex = require("knex");
  constructor(dbOptions) {
    this.dbOptions = dbOptions;
    this.table = "productos";
  }

  #createMySQL() {
    return this.#knex(this.dbOptions);
  }

  async createTblProducts(newTable) {
    this.table = newTable;
    try {
      const db = this.#createMySQL();
      const tableExists = await db.schema.hasTable(newTable);
      if (!tableExists) {
        await db.schema.createTable(newTable, (table) => {
          table.increments("id").primary().notNullable();
          table.string("title", 20).notNullable();
          table.decimal("price", 6, 2).notNullable();
          table.string("thumbnail", 255).notNullable();
        });
        db.destroy();
        exampleProducts.forEach(async (prod) => {
          await this.addNewProduct(prod);
        });
        return {
          status: 200,
          content: { success: `Tabla ${newTable} creada` },
        };
      } else {
        db.destroy();
        return {
          status: 200,
          content: { success: `No se requiere crear la tabla ${newTable}` },
        };
      }
    } catch (err) {
      db.destroy();
      return { status: 500, content: err };
    }
  }

  async getProducts() {
    try {
      const db = this.#createMySQL();
      let products = await db.select().from(this.table);
      if (products.length > 0) {
        db.destroy();
        return { status: 200, content: products };
      } else {
        db.destroy();
        return {
          status: 200,
          content: { error: `No hay productos a mostrar` },
        };
      }
    } catch (err) {
      db.destroy();
      return { status: 500, content: { error: `${err}` } };
    }
  }

  async getProductById(id) {
    try {
      if (!isNaN(parseInt(id))) {
        const db = this.#createMySQL();
        const selectedProduct = await db(this.table).where("id", id);
        db.destroy();
        return selectedProduct != undefined && selectedProduct != null
          ? { status: 200, content: selectedProduct[0] }
          : { status: 200, content: { error: `Producto no encontrado` } };
      } else {
        return { status: 400, content: { error: `Error en la petición` } };
      }
    } catch (err) {
      return { status: 500, content: err };
    }
  }

  async delProductById(id) {
    try {
      if (!isNaN(parseInt(id))) {
        const db = this.#createMySQL();
        let del = await db(this.table).where("id", id).del();
        if (del == 1) {
          db.destroy();
          return {
            status: 200,
            content: { success: `Producto con ID: ${id} borrado` },
          };
        } else {
          db.destroy();
          return { status: 200, content: { error: `Producto no encontrado` } };
        }
      } else {
        return { status: 400, content: { error: `Error en la petición` } };
      }
    } catch (err) {
      return { status: 500, content: err };
    }
  }

  async addNewProduct(product) {
    try {
      if (
        product.title &&
        !isNaN(parseFloat(product.price)) &&
        product.thumbnail
      ) {
        const db = this.#createMySQL();
        let newId = await db(this.table).insert(product);
        let newProduct = JSON.parse(
          JSON.stringify(await this.getProductById(newId))
        );
        db.destroy();
        return { status: 200, content: newProduct.content };
      } else {
        return { status: 400, content: { error: `Error en la petición` } };
      }
    } catch (err) {
      db.destroy();
      return {
        status: 500,
        content: `Error en el servidor: ${err}`,
      };
    }
  }

  async updateProduct(id, product) {
    if (
      !isNaN(parseInt(id)) &&
      product.title &&
      !isNaN(parseFloat(product.price)) &&
      product.thumbnail
    ) {
      try {
        const db = this.#createMySQL();
        if ((await db(this.table).where("id", id).update(product)) == 1) {
          db.destroy();
          return { status: 200, content: { success: `Producto actualizado` } };
        } else {
          db.destroy();
          return { status: 200, content: { error: `Producto no encontrado` } };
        }
      } catch (err) {
        db.destroy();
        return { status: 500, content: { error: err } };
      }
    } else {
      return { status: 400, content: { error: `Error en la petición.` } };
    }
  }
};

module.exports.ChatMsgsMySQLDB = class ChatMsgsDB {
  #knex = require("knex");
  constructor(dbOptions) {
    this.dbOptions = dbOptions;
    this.table = "chatmsgs";
  }

  #createMySQL() {
    return this.#knex(this.dbOptions);
  }

  async createTblChatMsgs(newTable) {
    this.table = newTable;
    try {
      const db = this.#createMySQL();
      const tableExists = await db.schema.hasTable(newTable);
      if (!tableExists) {
        await db.schema.createTable(newTable, (table) => {
          table.increments("id").primary().notNullable();
          table.string("email", 60).notNullable();
          table.datetime("datetime").notNullable();
          table.string("msg", 255).notNullable();
        });
        db.destroy();
        return {
          status: 200,
          content: { success: `Tabla ${newTable} creada` },
        };
      } else {
        db.destroy();
        return {
          status: 200,
          content: { success: `No se requiere crear la tabla ${newTable}` },
        };
      }
    } catch (err) {
      console.log(err);
      db.destroy();
      return { status: 500, content: err };
    }
  }

  async save(data) {
    try {
      data = { ...data };
      const date = require("date-and-time");
      const db = this.#createMySQL();
      data.datetime = date.format(
        new Date(data.datetime),
        "YYYY-MM-DD hh:mm:ss"
      );
      let idMsg = await db(this.table).insert(data);
      db.destroy();
      return { status: 200, content: `Mensaje guardado con ID ${idMsg}` };
    } catch (err) {
      console.log(err);
      db.destroy();
      return { status: 500, content: `Error en el servidor: ${err}` };
    }
  }
};
