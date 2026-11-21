const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  base64String: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
