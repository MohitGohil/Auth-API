const jsonwebtoken = require("jsonwebtoken");
const User = require("../model/User");
const ACCESS_KEY = process.env.ACCESS_KEY ?? "secret";

const verifyJwt = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken)
      return res.status(401).json({ message: "Unauthorized access - Token not found!" });
    // verify accessToken
    const result = jsonwebtoken.verify(accessToken, ACCESS_KEY);
    const foundUser = await User.findOne({ user: result?.user });
    if (!foundUser) return res.status(401).json({ message: "Invalid user. Please login again!" });
    next();
  } catch (err) {
    return res.status(401).json({ message: `Unauthorized access - Token expired!` }); //invalid token
  }
};

module.exports = verifyJwt;
