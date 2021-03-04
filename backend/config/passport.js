const { authSecret } = require("../.env");
const passport = require("passport");
const passportJwt = require("passport-jwt");
const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
  const params = {
    // Passei o segredo
    secretOrKey: authSecret,
    // Passei o token que está no header da request
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  // payload que está dentro de auth.js
  const strategy = new Strategy(params, (payload, done) => {
    app
      .db("users")
      .where({ id: payload.id })
      .first()
      // Primeiro para é o ERROR
      // Caso o usuário seja valido passa o TUDO do payload
      .then((user) => done(null, user ? { ...payload } : false))
      .catch((err) => done(err, false));
  });

  passport.use(strategy);

  return {
    // Filtrar as requisições para permitir que as elas sejam
    //feitas para aqueles que precisam ter um usuário logado para executar
    authenticate: () => passport.authenticate("jwt", { session: false }),
  };
};
