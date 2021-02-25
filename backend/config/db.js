const config = require("../knexfile.js");
const knex = require("knex")(config);

// Para rodar as migrations quando subir o projeto
// knex.migrate.latest([config]);
module.exports = knex;
