const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["General", "Advanced"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Element", elementSchema);
