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

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "123",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "124", // 123
      entries: 0,
      joined: new Date(),
    },
  ],
};

// conver plaintext to hash
database.users.forEach((user) => {
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    user.password = hash;
  });
});

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  for (let user of database.users) {
    if (email === user.email) {
      return bcrypt.compareSync(password, user.password)
        ? res.json(user)
        : res.json("password fail");
    }
  }
  res.json("email fail");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    const newUser = {
      id: "125",
      name: name,
      email: email,
      password: hash,
      entries: 0,
      joined: new Date(),
    };
    // database.users.push(newUser);
    db("users")
      .returning("*")
      .insert({
        name: name,
        email: email,
        joined: new Date(),
      })
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        res.status(400).json("unable to register");
      });
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
  db;
  database.users.forEach((user) => {
    if (id === user.id) {
      user.entries++;
      return res.json(user.entries);
    }
  });
  res.status(400).json("not found");
});

app.listen(3000, () => {
  console.log("smart-brain-api is listening on port 3000");
});
