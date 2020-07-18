const express = require("express");

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
      password: "123",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  for (let user of database.users) {
    if (email === user.email && password === user.password) {
      res.status(200).json("success");
      return;
    }
  }
  res.status(400).json("fail");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const newUser = {
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  };
  database.users.push(newUser);
  res.status(200).json(newUser);
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
