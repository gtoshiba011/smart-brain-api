const redisClient = require("../controllers/signin").redisClient;

const requireAuth = (req, res, next) => {
  const { authentication } = req.headers;

  if (!authentication) {
    return res.status(401).json("Unauthorized");
  }
  return redisClient.get(authentication, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json("Unauthorized");
    }
    console.log("You shall pass");
    return next();
  });
};

module.exports = {
  requireAuth,
};
