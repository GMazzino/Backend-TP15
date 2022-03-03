module.exports.ChatMsgsDB = class ChatMsgsDB {
  #knex = require("knex");
  constructor(dbOptions) {
    this.dbOptions = dbOptions;
  }

  #createSQLite3() {
    return this.#knex(this.dbOptions);
  }

  async createTblChatMsgs(newTable) {
    try {
      const db = this.#createSQLite3();
      const tableExists = await db.schema.hasTable(newTable);
      if (!tableExists) {
        await db.schema.createTable(newTable, (table) => {
          table.increments("id").primary().notNullable();
          table.string("email", 60).notNullable();
          table.timestamp("datetime", (options = { useTZ: true }));
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
      db.destroy();
      return { status: 500, content: err };
    }
  }
};
