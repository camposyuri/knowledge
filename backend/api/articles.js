const { query } = require("express");
const queries = require("./queries");

module.exports = (app) => {
  const { existsOrError } = app.api.validation;

  const save = (req, res) => {
    const article = { ...req.body };

    // Se esse cara estiver presente atribuo ele ao meu article.id
    if (req.params.id) {
      article.id = req.params.id;
    }

    try {
      existsOrError(article.name, "Nome não informado");
      existsOrError(article.description, "Decrição não informada");
      existsOrError(article.categoryId, "Categoria não informada");
      existsOrError(article.userId, "Autor não informado");
      existsOrError(article.content, "Conteúdi não informado");
    } catch (msg) {
      return res.status(400).send(msg);
    }

    // Se o ID existir faz um update, senão faz o insert
    if (article.id) {
      app
        .db("articles")
        .update(article)
        .where({ id: article.id })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } else {
      app
        .db("articles")
        .insert(article)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    }
  };

  const remove = async (req, res) => {
    try {
      // Se retornar 1 ele passa, senão retornar 0 lança a mensagem
      const rowsDeleted = await app
        .db("articles")
        .where({ id: req.params.id })
        .del();

      try {
        // Passou um ID que não existe ele vai dar erro
        existsOrError(rowsDeleted, "Artigo não encontrado");
      } catch (msg) {
        return res.status(400).send(msg);
      }

      return res.status(204).send();
    } catch (msg) {
      return res.status(500).send(msg);
    }
  };

  // consulta paginada
  const limit = 10;
  const get = async (req, res) => {
    // Pegando o valor da pagina que vem na queryString ou atribuindo o valor 1
    const page = req.query.page || 1;

    const results = await app.db("articles").count("id").first();
    const count = parseInt(results.count);

    app
      .db("articles")
      .select("id", "name", "description")
      .limit(limit)
      // É o deslocamento: Apartir de onde vai começar a contar
      // 1 * 10 - 10 = 0
      .offset(page * limit - limit)
      .then((articles) => res.json({ data: articles, count, limit }))
      .catch((err) => res.status(500).send(err));
  };

  const getById = (req, res) => {
    app
      .db("articles")
      .where({ id: req.params.id })
      .first()
      .then((article) => {
        article.content = article.content.toString();
        return res.json(article);
      })
      .catch((err) => res.status(500).send(err));
  };

  const getByCategory = async (req, res) => {
    const categoryId = req.params.id;
    const page = req.query.page || 1;
    const categories = await app.db.raw(
      queries.categoryWithChildren,
      categoryId
    );
    // Array de IDs o proprio id da categoria pai + os IDs da categoria filhas
    const ids = categories.rows.map((c) => c.id);

    app
      .db({ a: "articles", u: "users" })
      .select("a.id", "a.name", "a.description", "a.imageUrl", {
        author: "u.name",
      })
      .limit(limit)
      .offset(page * limit - limit)
      .whereRaw("?? = ??", ["u.id", "a.userId"])
      .whereIn("categoryId", ids)
      .orderBy("a.id", "desc")
      .then((articles) => res.json(articles))
      .catch((err) => res.status(500).send(err));
  };

  return {
    save,
    remove,
    get,
    getById,
    getByCategory,
  };
};
