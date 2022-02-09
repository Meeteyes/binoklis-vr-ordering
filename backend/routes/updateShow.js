import express from "express";
import authenticateUser from "../utils/authenticateUser.js";
import Show from "../models/show.js";

const router = express.Router();

router.patch("/", authenticateUser);
router.patch("/", async (req, res) => {
  const { id, contactPerson, email, phone, address, isConfirmed } = req.body;
  try {
    const show = await Show.findOneAndUpdate(
      { _id: id },
      { contactPerson, email, phone, address, isConfirmed },
      { new: true }
    ).populate("city");
    if (show) {
      res.status(200).json({ response: show, success: true });
    } else {
      res
        .status(200)
        .json({ response: "Event with such id not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

router.delete("/", authenticateUser);
router.delete("/", async (req, res) => {
  const { id } = req.query;
  if (id) {
    try {
      const deletedItem = await Show.deleteOne({ _id: id });
      res.status(200).json({ response: "Item was deleted", success: true });
    } catch (error) {
      res.status(400).json({ response: error, success: false });
    }
  } else {
    res.status(400).json({ response: "Id must be provided", success: false });
  }
});

export default router;
