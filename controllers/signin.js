const jwt = require("jsonwebtoken");
// only return promise instead of response
// return response in signinAuthentication
const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;

  // validate signin information
  if (!email || !password) {
    return Promise.reject("invalid signin information");
  }

  return db
    .select("email", "hash")
    .from("login")
    .where({ email: email })
    .then((user) => {
      if (user.length) {
        if (bcrypt.compareSync(password, user[0].hash)) {
          return db
            .select("*")
            .from("users")
            .where({ email: email })
            .then((user) => user[0]);
        } else {
          return Promise.reject("wrong password");
        }
      } else {
        return Promise.reject("wrong email");
      }
    })
    .catch((err) => Promise.reject(err));
};

const getAuthTokenId = () => {
  console.log("auth OK");
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, "JWT_SECRET", { expiresIn: "2 days" });
};

const createSessions = (user) => {
  // JWT token, return user data
  const { email, id } = user;
  const token = signToken(email);
  return { success: "true", userId: id, token };
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId()
    : handleSignin(db, bcrypt, req, res)
        .then((data) => {
          return data.id && data.email
            ? createSessions(data)
            : Promise.reject(data);
        })
        .then((session) => {
          res.json(session);
        })
        .catch((err) => res.status(400).json(err));
};

module.exports = {
  signinAuthentication,
};
