const jwt = require("jsonwebtoken");
const redis = require("redis");

// setup Redis
const redisClient = redis.createClient(process.env.REDIS_URI);

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

const getAuthTokenId = (req, res) => {
  const { authentication } = req.headers;
  return redisClient.get(authentication, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json("Unauthorized");
    } else {
      return res.json({ userId: reply });
    }
  });
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, "JWT_SECRET", { expiresIn: "2 days" });
};

// return a promise
const redisSet = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSessions = (user) => {
  // JWT token, return user data
  const { email, id } = user;
  const token = signToken(email);
  return redisSet(token, id)
    .then(() => {
      return { success: "true", userId: id, token };
    })
    .catch(console.log);
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authentication } = req.headers;
  return authentication
    ? getAuthTokenId(req, res)
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
  redisClient,
};
