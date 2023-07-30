const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    user: {
      type: String,
      required: [true, "please provide a username"],
      trim: true,
    },
    psw: {
      type: String,
      required: [true, "please provide a password"],
      trim: true,
      minlength: 2,
      // maxLength: 20,
    },
    email: {
      type: String,
      required: [true, "please provide a email"],
      trim: true,
    },
    refreshToken: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
