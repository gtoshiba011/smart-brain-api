const handleRegister = (db, bcrypt, saltRounds) => (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);

  // Using trx as a transaction object:
  db.transaction((trx) => {
    trx
      .insert({
        email: email,
        hash: hash,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .returning("*")
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    res.status(400).json("register transaction fail");
  });
};

module.exports = {
  handleRegister,
};
