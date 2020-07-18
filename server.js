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
  res.json(newUser);
});

app.listen(3000, () => {
  console.log("smart-brain-api is listening on port 3000");
});

/*
/ -> root
/signin -> POST, return success/fail
/register -> POST, return user
/profile/:userId -> GET, return user
/image -> PUT, return user
*/
