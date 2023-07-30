require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const helmet = require("helmet");
const connectDB = require("./config/mongoConfig");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRouter = require("./routes/authRoute");

// Server config
const app = express();
const server = createServer(app);
const PORT = process.env.PORT ?? 8000;

// db connection
connectDB();

// helpful lib
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to auth API" });
});

// route to auth
app.use("/auth", authRouter);

// Invalid route
app.use("*", (req, res) => {
  res.status(404).json({ message: "Invalid route!" });
});

// Error handler
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
