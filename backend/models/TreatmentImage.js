const mongoose = require('mongoose');

const treatmentImageSchema = new mongoose.Schema({
  treatmentName: { type: String, required: true, unique: true },
  base64String: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TreatmentImage', treatmentImageSchema);
