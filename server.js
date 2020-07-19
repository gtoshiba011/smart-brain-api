const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cors = require("cors");
const knex = require("knex");
const { response } = require("express");

const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// setup database (Postgres)
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "",
    password: "",
    database: "smart-brain",
  },
});
// CREATE TABLE login (id serial PRIMARY KEY, hash VARCHAR(100) NOT NULL, email text UNIQUE NOT NULL);
// CREATE TABLE users (id serial PRIMARY KEY, name VARCHAR(100), email text UNIQUE NOT NULL, entries bigint DEFAULT 0, joined TIMESTAMP NOT NULL);

app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((users) => res.send(users))
    .catch((err) => res.status(400).send("error"));
});

app.post("/signin", (req, res) => {
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
});

app.post("/register", (req, res) => {
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
    console.log(err);
    res.status(400).json("register transaction fail");
  });
});

app.get("/profile/:id", (req, res) => {
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
});

app.put("/image", (req, res) => {
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
});

app.listen(3000, () => {
  console.log("smart-brain-api is listening on port 3000");
});
