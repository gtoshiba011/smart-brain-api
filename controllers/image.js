const Clarifai = require("clarifai");

const clarifaiApp = new Clarifai.App({
  apiKey: "923bdb65ba984677ac69f43368456e4f",
});

const handleApiCall = (req, res) => {
  clarifaiApp.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Unable to work with image Api"));
};

const handleImage = (db) => (req, res) => {
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
  handleApiCall,
};
