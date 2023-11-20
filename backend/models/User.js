import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// bcrypt hashing
userSchema.pre("save", async function (next) {
  try {
    const saltRounds = 12;
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
    console.log(`Password of ${this.username} got hashed`);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.authenticate = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = new model("User", userSchema);
