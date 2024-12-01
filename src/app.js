const express = require("express");

const shoppingListRoutes = require("./routes/shopping-list");
const app = express();

app.use("/shopping-list", shoppingListRoutes);

module.exports = app;
