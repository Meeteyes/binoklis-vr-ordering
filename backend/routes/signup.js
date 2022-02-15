import express from "express";
import bcrypt from "bcrypt-nodejs";

import Admin from "../models/admin.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password, email } = req.body;
  const salt = bcrypt.genSaltSync();
  try {
    const newAdmin = await new Admin({
      username,
      password: bcrypt.hashSync(password, salt),
      email,
    }).save();
    res.status(201).json({ response: newAdmin, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

export default router;
