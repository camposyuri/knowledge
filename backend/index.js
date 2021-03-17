const app = require("express")();
const consign = require("consign");
const db = require("./config/db.js");
const mongoose = require("mongoose");

require("./config/mongodb");

app.db = db;
app.mongoose = mongoose;

// Injetando o app que tem o EXPRESS nele dentro do meu middlewares.js
consign()
  .include("./config/passport.js")
  .then("./config/middlewares.js")
  .then("./api/validation.js")
  .then("./api")
  .then("./schedule")
  .then("./config/routes.js")
  .into(app);

app.listen(3333, () => {
  console.log("Backend executando...");
});
