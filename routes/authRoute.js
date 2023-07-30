const authRouter = require("express").Router();
const authController = require("../controller/auth");
const auth = new authController();

authRouter.get("/", (req, res) => {
  res.json({ message: "Welcome to auth route" });
});

authRouter.post("/register", auth.register);

authRouter.post("/login", auth.login);

authRouter.get("/logout", auth.logout);

module.exports = authRouter;
