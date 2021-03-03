const { authSecret } = require("../.env");
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt-nodejs");

module.exports = (app) => {
  const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send("Informe usuário e senha!");
    }

    const user = await app.db("users").where({ email: req.body.email }).first();

    if (!user) {
      res.status(400).send("Usuário não encontrado");
    }

    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send("E-mail ou senha inválido");
    }

    // Pegando a data em segundos
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      iat: now,
      exp: now + 60 * 60 * 24 * 3,
    };
    // issued at -> emitido em
    // Mais 60S * 60M * 24H  * 3 TOKEN VALE 3 DAIS

    // Gerar o token
    res.json({
      ...payload,
      token: jwt.encode(payload, authSecret),
    });
  };

  const validateToken = async (req, res) => {
    const userData = req.body || null;

    try {
      if (userData) {
        // Descodificar o token
        const token = jwt.decode(userData.token, authSecret);
        if (new Date(token.exp * 1000) > new Date()) {
          // Quando o token está valido
          return res.send(true);
        }
      }
    } catch (err) {
      // Problema com o token
    }
    // Quando o token está inválido
    res.send(false);
  };

  return {
    signin,
    validateToken,
  };
};
