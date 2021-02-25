exports.up = async (knex) => {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNull();
    table.string("email").notNull().unique();
    table.string("password").notNull();
    table.boolean("admin").notNull().defaultTo("false");
  });
};

exports.down = async (knex) => {
  return knex.schema.dropTable("users");
};
