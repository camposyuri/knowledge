const admin = require("./admin");

module.exports = (app) => {
  // Cadastrando um novo usuário
  app.post("/signup", app.api.user.save);
  // Logando com um usuário existente no sistema
  app.post("/signin", app.api.auth.signin);
  app.post("/validateToken", app.api.auth.validateToken);

  app
    .route("/users")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.user.get))
    .post(admin(app.api.user.save));

  app
    .route("/users/:id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.user.getById))
    .put(admin(app.api.user.save))
    .delete(admin(app.api.user.remove));

  app
    .route("/categories")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.category.get))
    .post(admin(app.api.category.save));

  // Cuidado com ordem! Tem que vir antes de /categories/:id
  app
    .route("/categories/tree")
    .all(app.config.passport.authenticate())
    .get(app.api.category.getTree);

  app
    .route("/categories/:id")
    .all(app.config.passport.authenticate())
    .get(app.api.category.getById)
    .put(admin(app.api.category.save))
    .delete(admin(app.api.category.remove));

  app
    .route("/articles")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.articles.get))
    .post(admin(app.api.articles.save));

  app
    .route("/articles/:id")
    .all(app.config.passport.authenticate())
    .get(app.api.articles.getById)
    .put(admin(app.api.articles.save))
    .delete(admin(app.api.articles.remove));

  app
    .route("/categories/:id/articles")
    .all(app.config.passport.authenticate())
    .get(app.api.articles.getByCategory);

  app
    .route("/stats")
    .all(app.config.passport.authenticate())
    .get(app.api.stat.get);
};
