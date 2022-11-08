import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "please, provide an email."],
    unique: [true, "This email has been taken."],
  },
  password: {
    type: String,
    required: [true, "please, provide an password."],
    unique: true,
  },
});

UserSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    next();
  });
});

const User = mongoose.model("User", UserSchema);

export default User;
