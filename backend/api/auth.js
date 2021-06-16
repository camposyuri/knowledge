const { authSecret } = require("../.env");
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt-nodejs");

module.exports = (app) => {
  const signin = async (req, res) => {
    // Verificando se o usuáro passou o email e senha nos campos
    if (!req.body.email || !req.body.password) {
      return res.status(400).send("Informe usuário e senha!");
    }

    // Caso o usuário tenha passado o email e senha nos campos
    // Vou fazer um select no banco vendo se existe aquele email cadastrado
    // SELECT * FROM users WHERE email LIKE '%yurinapoleao@gmail.com%';
    const user = await app.db("users").where({ email: req.body.email }).first();

    // Caso não exista ele irá retornar uma mensagem para o usuário
    if (!user) {
      res.status(400).send("Usuário não encontrado");
    }

    // Mas caso exista vou comparar a senha que o usuário passou no req.body
    // Com a senha que está cadastrada no banco de dados
    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    // Se a senha que foi passado no req.body não seja a igual a do banco na tabela de usuário
    // Retorno uma mensagem para o usuário
    if (!isMatch) {
      return res.status(401).send("E-mail ou senha inválido");
    }

    // Pegando a data em segundos para retornar no payload
    const now = Math.floor(Date.now() / 1000);

    // Crio uma const payload que vai ser retornado com os dados do usuário
    // Que foi cadastrado na tabela de usuário
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
    // E retornando ele como um JSON para o usuário
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
