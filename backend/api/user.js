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
      existsOrError(user.name, "Nome não informado");
      existsOrError(user.email, "E-mail não informado");
      existsOrError(user.password, "Senha não informada");
      existsOrError(user.confirmPassword, "Confirmação de Senha inválida");
      equalsOrError(user.password, user.confirmPassword, "Senhas não conferem");

      const userFromDB = await app
        .db("users")
        .where({ email: user.email })
        .first();

      // ID for diferente dos que já estão cadastrado ele cadastra
      if (!user.id) {
        notExistsOrError(userFromDB, "Usuário já foi cadastrado");
      }
    } catch (msg) {
      return res.status(400).send(msg);
    }

    // Encriptografando minha senha e deletando a confirmação de senha
    user.password = encryptPassword(user.password);
    delete user.confirmPassword;

    // Se tem ID ele vai dar um UPDATE senão INSERT um novo user
    if (user.id) {
      app
        .db("users")
        .update(user)
        .where({ id: user.id })
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

  const get = (req, res) => {
    app
      .db("users")
      .select("id", "name", "email", "admin")
      .then((users) => res.json(users))
      .catch((err) => res.status(500).send(err));
  };

  return {
    save,
    get,
  };
};
