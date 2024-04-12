const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone Number is required"],
    unique: [true, "Phone Number already in use"],
    trim: true,
    match: [/^[0-9]{10}$/, "Phone Number must be a 10-digit numeric string"],
  },
  emailId: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already in use"],
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid Email format",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must be at least 8 characters long"],
  },
  role: {
    type: String,
    enum: ["user", "startup"],
    default: "user",
  },
  accountCreatedAt: {
    type: Date,
    default: Date.now,
  },
  followers: {
    count: {
      type: Number,
      default: 0,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  following: {
    count: {
      type: Number,
      default: 0,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
});

// this is executed just before saving the data to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  // if the password is modified,then hash the password
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// method to check if the login password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  actualPassword
) {
  // this will return true if both are same
  return await bcrypt.compare(candidatePassword, actualPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
