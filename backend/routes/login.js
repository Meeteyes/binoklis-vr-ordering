import express from "express";
import Admin from "../models/admin.js";
import bcrypt from "bcrypt-nodejs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const loggedUser = await Admin.findOne({ username });
    if (loggedUser && bcrypt.compareSync(password, loggedUser.password)) {
      res.status(200).json({
        response: {
          username: loggedUser.username,
          userId: loggedUser._id,
          accessToken: loggedUser.accessToken,
        },
        success: true,
      });
    } else {
      res
        .status(401)
        .json({ response: "User or password not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

export default router;
