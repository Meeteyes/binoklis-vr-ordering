import mongoose from "mongoose";

const ShowSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  address: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    minlenght: "8",
    maxlength: "8",
  },
  email: {
    type: String,
    trim: true,
    required: "Email address is required",
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
});

const Show = new mongoose.model("Show", ShowSchema);

export default Show;
