const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

// setup database (Postgres)
const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI,
  // connection: {
  // host: process.env.POSTGRES_HOST,
  // user: process.env.POSTGRES_USER,
  // password: process.env.POSTGRES_PASSWORD,
  // database: procesws.env.POSTGRES_DB,
  // host: "127.0.0.1",
  // user: "",
  // password: "",
  // database: "smart-brain",
  // },
});
// CREATE TABLE login (id serial PRIMARY KEY, hash VARCHAR(100) NOT NULL, email text UNIQUE NOT NULL);
// CREATE TABLE users (id serial PRIMARY KEY, name VARCHAR(100), email text UNIQUE NOT NULL, entries bigint DEFAULT 0, joined TIMESTAMP NOT NULL);

app.get("/", (req, res) => {
  res.send("it works in Docker");
  // db.select("*")
  //   .from("users")
  //   .then((users) => res.send(users))
  //   .catch((err) => res.status(400).send("error"));
});

app.post("/signin", signin.signinAuthentication(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt, saltRounds));
app.get("/profile/:id", profile.handleProfileGet(db));
app.post("/profile/:id", (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});
app.put("/image", image.handleImage(db));
app.post("/imageApi", image.handleApiCall);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`smart-brain-api is listening on port ${port}`);
});
