import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import admin from "./routes/admin.js";
import bookedDates from "./routes/bookedDates.js";
import booking from "./routes/booking.js";
import cities from "./routes/cities.js";
import login from "./routes/login.js";
import signup from "./routes/signup.js";
import updateShow from "./routes/updateShow.js";

///---- MONGO DB ---
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/binoklis";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// The backend routes
app.use("/login", login);
app.use("/admin", admin);
app.use("/signup", signup);
app.use("/updateShow", updateShow);

app.use("/bookedDates", bookedDates);
app.use("/booking", booking);
app.use("/cities", cities);

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
