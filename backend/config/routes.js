module.exports = (app) => {
  app.post("/signup", app.api.user.save);
  app.post("/signin", app.api.auth.signin);
  app.post("/validateToken", app.api.auth.validateToken);

  app
    .route("/users")
    .all(app.config.passport.authenticate())
    .get(app.api.user.get)
    .post(app.api.user.save);

  app.route("/users/:id").get(app.api.user.getById).put(app.api.user.save);

  app
    .route("/categories")
    .all(app.config.passport.authenticate())
    .get(app.api.category.get)
    .post(app.api.category.save);

  // Cuidado com ordem! Tem que vir antes de /categories/:id
  app
    .route("/categories/tree")
    .all(app.config.passport.authenticate())
    .get(app.api.category.getTree);

  app
    .route("/categories/:id")
    .all(app.config.passport.authenticate())
    .get(app.api.category.getById)
    .put(app.api.category.save)
    .delete(app.api.category.remove);

  app
    .route("/articles")
    .all(app.config.passport.authenticate())
    .get(app.api.articles.get)
    .post(app.api.articles.save);

  app
    .route("/articles/:id")
    .all(app.config.passport.authenticate())
    .get(app.api.articles.getById)
    .put(app.api.articles.save)
    .delete(app.api.articles.remove);

  app
    .route("/categories/:id/articles")
    .all(app.config.passport.authenticate())
    .get(app.api.articles.getByCategory);
};
