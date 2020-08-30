const handleProfileGet = (db) => (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("not found");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
};

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  // TOOD: check id exists

  const { name, age, pet } = req.body.formInput;
  db.from("users")
    .where({ id })
    .update({ name, age, pet })
    .then((resp) => {
      if (resp) {
        res.json("success");
      } else {
        res.status(400).json("unable to update");
      }
    })
    .catch((err) => res.status(400).json("error updating user"));
};

module.exports = {
  handleProfileGet,
  handleProfileUpdate,
};
