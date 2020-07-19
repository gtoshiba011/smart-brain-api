const handleImage = (req, res, db) => {
  const { id } = req.body;
  db.select("entries")
    .from("users")
    .where({ id: id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      if (entries.length) {
        res.json(Number(entries[0]));
      } else {
        res.status(400).json("not found");
      }
    })
    .catch((err) => res.status(400).json("error getting entries"));
};

module.exports = {
  handleImage,
};
