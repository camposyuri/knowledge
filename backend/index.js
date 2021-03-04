const app = require("express")();
const consign = require("consign");
const db = require("./config/db.js");

app.db = db;

// Injetando o app que tem o EXPRESS nele dentro do meu middlewares.js
consign()
  .include("./config/passport.js")
  .then("./config/middlewares.js")
  .then("./api/validation.js")
  .then("./api")
  .then("./config/routes.js")
  .into(app);

app.listen(3333, () => {
  console.log("Backend executando...");
});
