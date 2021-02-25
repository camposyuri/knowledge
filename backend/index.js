const app = require("express")();
const consign = require("consign");

// Injetando o app que tem o EXPRESS nele dentro do meu middlewares.js
consign().then("./config/middlewares.js").into(app);

app.listen(3333, () => {
  console.log("Backend executando...");
});
