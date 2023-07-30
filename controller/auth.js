const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/User");
const ACCESS_KEY = process.env.ACCESS_KEY ?? "secret";
const REFRESH_KEY = process.env.REFRESH_KEY ?? "secret";

class Auth {
  async register(req, res) {
    const { user, psw, email } = req.body;
    if (!user || !psw || !email) return res.status(400).json({ message: "Input can not be empty" });
    const hashPass = await bcrypt.hash(psw, 10);
    try {
      const alreadyExist = await User.findOne({ $or: [{ user: user }, { email: email }] });
      if (!alreadyExist) {
        const result = await User.create({ user, email, psw: hashPass });
        return res
          .status(201)
          .json({ message: `Hi ${result.user}, You have successfully registered.` });
      }
      return res.status(400).json({ message: "User Already Exist" });
    } catch (err) {
      return res.status(500).json({ message: "Something went wrong!", err });
    }
  }
  async login(req, res) {
    const { user, psw, email } = req.body;
    if (!user || !psw || !email) return res.status(400).json({ message: "Input can not be empty" });
    try {
      const foundUser = await User.findOne({ user: user });
      if (foundUser) {
        const matchPass = await bcrypt.compare(psw, foundUser.psw);
        if (matchPass) {
          const accessToken = await jsonwebtoken.sign({ user, email }, ACCESS_KEY, {
            expiresIn: "1min",
          });
          const refreshToken = await jsonwebtoken.sign({ user, email }, REFRESH_KEY, {
            expiresIn: "5min",
          });
          await User.findOneAndUpdate({ user: user }, { refreshToken: refreshToken });
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 1000 * 60 * 1,
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 1000 * 60 * 5,
          });
          return res.status(201).json({ message: `Successfully logged in. Hi ${foundUser.user}` });
        } else {
          return res.status(401).json({ message: "Invalid credentials" });
        }
      } else {
        return res.status(400).json({ message: "User not found!" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Something went wrong!", err });
    }
  }
  async logout(req, res) {
    // find cookie in headers
    const { refreshToken: clientRefreshToken } = req.cookies;
    // Check refresh token exist
    if (!clientRefreshToken) return res.status(204).json({ message: "Already logged out!" });
    // if exits, remove refresh token from client side and db
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    await User.findOneAndUpdate({ refreshToken: clientRefreshToken }, { refreshToken: "" });
    return res.status(204).json({ message: "Logged out successfully!" });
  }
}

module.exports = Auth;
