const express = require("express");
const { Router } = express;
const router = Router();
const { productsDBOptions } = require("../app_options");
const { ProductsMySQLDB } = new require("../api/api_mysql");
const productsDB = new ProductsMySQLDB(productsDBOptions);

router.get("/", async (req, res) => {
  let ans = await productsDB.getProducts();
  res.status(ans.status).json(ans.content);
});

router.get("/:id", async (req, res) => {
  let ans = await productsDB.getProductById(req.params.id);
  res.status(ans.status).json(ans.content);
});

router.post("/", async (req, res) => {
  let ans = await productsDB.addNewProduct(req.body);
  let products = await productsDB.getProducts();
  req.app.io.sockets.emit("renderProducts", products.content);
  res.status(ans.status).json(ans.content);
});

router.put("/:id", async (req, res) => {
  let ans = await productsDB.updateProduct(req.params.id, req.body);
  res.status(ans.status).json(ans.content);
});

router.delete("/:id", async (req, res) => {
  let ans = await productsDB.delProductById(req.params.id);
  res.status(ans.status).json(ans.content);
});

module.exports.router_products = router;
module.exports.products = productsDB;
