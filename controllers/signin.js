const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  db.select("email", "hash")
    .from("login")
    .where({ email: email })
    .then((user) => {
      if (user.length) {
        if (bcrypt.compareSync(password, user[0].hash)) {
          return db
            .select("*")
            .from("users")
            .where({ email: email })
            .then((user) => res.json(user[0]));
        } else {
          res.json("wrong password");
        }
      } else {
        res.json("wrong email");
      }
    })
    .catch((err) => res.json("signin fail"));
};

module.exports = {
  handleSignin,
};
