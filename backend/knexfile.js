// Update with your config settings.

module.exports = {
  client: "pg",
  connection: {
    database: "db_wn",
    user: "postgres",
    password: "123456",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
