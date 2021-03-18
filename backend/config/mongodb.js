const mongoose = require("mongoose");
const { hostMongo, mongoAuth } = require("../.env");

// Connect with MongoDB
mongoose
  .connect(hostMongo, {
    useNewUrlParser: true,
    auth: {
      user: mongoAuth.user,
      password: mongoAuth.password,
    },
  })
  .catch((e) => {
    const msg = "ERRO! Não foi possível conectar com o MongoDB!";
    console.log("\x1b[41m%s\x1b[37m", msg, "\x1b[0m");
  });
