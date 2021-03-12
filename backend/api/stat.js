module.exports = (app) => {
  // Model
  const Stat = app.mongoose.model("Stat", {
    users: Number,
    categories: Number,
    articles: Number,
    createdAt: Date,
  });

  const get = (req, res) => {
    // TODO: Primeiro parametro é o Filtro, segundo oq vc quer selecionar
    Stat.findOne({}, {}, { sort: { createdAt: -1 } }).then((stat) => {
      const defaultStat = {
        users: 0,
        categories: 0,
        articles: 0,
      };
      res.json(stat || defaultStat);
    });
  };

  return { Stat, get };
};
