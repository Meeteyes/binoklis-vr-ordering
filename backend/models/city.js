import mongoose from "mongoose";
const CitySchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: true,
    unique: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

const City = new mongoose.model("City", CitySchema);

export default City;
