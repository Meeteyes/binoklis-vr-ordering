import mongoose from "mongoose";
import crypto from "crypto";

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minLenght: 5,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
});

const Admin = new mongoose.model("Admin", AdminSchema);

export default Admin;
