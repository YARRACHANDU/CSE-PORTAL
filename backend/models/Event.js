const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  studentName: { type: String },
  certUrl: { type: String, required: true },
});

const gallerySchema = new mongoose.Schema({
  imgUrl: { type: String, required: true },
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  eventImgUrl: String,
  certificates: [certificateSchema],
  gallery: [gallerySchema],
});

module.exports = mongoose.model("Event", eventSchema);
