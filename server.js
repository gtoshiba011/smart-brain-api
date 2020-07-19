const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
        ? res.status(200).json("success")
        : res.status(400).json("password fail");
    }
  }
  res.status(400).json("email fail");
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
    database.users.push(newUser);
    res.status(200).json(newUser);
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  database.users.forEach((user) => {
    if (id === user.id) {
      return res.status(200).json(user);
    }
  });
  res.status(400).json("not found");
});

app.post("/image", (req, res) => {
  const { id } = req.body;
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
