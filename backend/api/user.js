const bcrypt = require("bcrypt-nodejs");

module.exports = (app) => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

  // Função para criptografar a senha do usuário
  const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  // Faz o metodo POST e PUT
  const save = async (req, res) => {
    const user = { ...req.body };

    if (req.params.id) {
      user.id = req.params.id;
    }

    try {
      existsOrError(user.name, "Name not provided");
      existsOrError(user.email, "Email not informed");
      existsOrError(user.password, "Password not entered");
      existsOrError(user.confirmPassword, "Invalid Password Confirmation");
      equalsOrError(
        user.password,
        user.confirmPassword,
        "Passwords do not match"
      );

      const userFromDB = await app
        .db("users")
        .where({ email: user.email })
        .first();

      // ID for diferente dos que já estão cadastrado ele cadastra
      if (!user.id) {
        notExistsOrError(userFromDB, "User has already been registered");
      }
    } catch (msg) {
      return res.status(400).send(msg);
    }

    // Encriptografando minha senha e deletando a confirmação de senha
    user.password = encryptPassword(user.password);
    delete user.confirmPassword;

    // Se tem ID ele vai dar um UPDATE senão INSERT um novo user
    // Usuando o filtro para atualizar somente
    //os usuários que estão com a coluna deletedAt = NULL
    if (user.id) {
      app
        .db("users")
        .update(user)
        .where({ id: user.id })
        .whereNull("deletedAt")
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } else {
      app
        .db("users")
        .insert(user)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    }
  };

  // Usuando o filtro para trazer somente
  //os usuários que estão com  a coluna deletedAt = NULL
  const get = (req, res) => {
    app
      .db("users")
      .select("id", "name", "email", "admin")
      .whereNull("deletedAt")
      .then((users) => res.json(users))
      .catch((err) => res.status(500).send(err));
  };

  // Usuando o filtro para trazer somente
  //os usuários que estão com a coluna deletedAt = NULL
  const getById = (req, res) => {
    app
      .db("users")
      .select("id", "name", "email", "admin")
      .where({ id: req.params.id })
      .whereNull("deletedAt")
      .first()
      .then((user) => res.json(user))
      .catch((err) => res.status(500).send(err));
  };

  // Fazendo um softDeleted
  const remove = async (req, res) => {
    try {
      const articles = await app
        .db("articles")
        .where({ userId: req.params.id });
      notExistsOrError(articles, "Usuário possui artigos.");

      const rowsUpdated = await app
        .db("users")
        .update({ deletedAt: new Date() })
        .where({ id: req.params.id });
      existsOrError(rowsUpdated, "Usuário não foi encontrado");

      return res.status(204).send();
    } catch (msg) {
      return res.status(400).send(msg);
    }
  };

  return {
    save,
    get,
    getById,
    remove,
  };
};
