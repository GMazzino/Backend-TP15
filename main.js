const express = require("express");
const app = express();
const { router_products } = require("./routes/products");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const msgs = [];
const serverPort = 8080;

//***** CREO TABLA PRODUCTOS *****//
const { productsDBOptions } = require("./app_options");
const { ProductsMySQLDB } = new require("./api/api_mysql");
const productsDB = new ProductsMySQLDB(productsDBOptions);
productsDB
  .createTblProducts("productos")
  .then()
  .catch((err) => {
    console.log(err);
  });

//***** DB MENSAJES DE CHAT *****//
const { chatMsgsDBOptions } = require("./app_options");
const { ChatMsgsMySQLDB } = new require("./api/api_mysql");
const chatMsgsDB = new ChatMsgsMySQLDB(chatMsgsDBOptions);
chatMsgsDB
  .createTblChatMsgs("chatmsgs")
  .then()
  .catch((err) => {
    console.log(err);
  });

// ***** SERVER *****//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/products", router_products);
app.io = io;
httpServer
  .listen(serverPort, () => {
    console.log(`Servidor activo y escuchando en puerto ${serverPort}`);
  })
  .on("error", (error) => console.log(error.message));

io.on("connection", async (socket) => {
  console.log("User connected");
  let ans = await productsDB.getProducts();
  io.sockets.emit("renderProducts", ans.content);
  socket.on("chatMsg", (msg) => {
    msg = JSON.parse(msg);
    const d = new Date();
    msg.datetime = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
    chatMsgsDB.save(msg);
    msgs.push(msg);
    io.sockets.emit("newChatMsg", JSON.stringify(msgs));
  });
});
