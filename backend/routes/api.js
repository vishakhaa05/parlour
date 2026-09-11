const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const GalleryImage = require('../models/GalleryImage');
const TreatmentImage = require('../models/TreatmentImage');

// --- Users ---
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// --- Appointments ---
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/appointments', async (req, res) => {
  const appointment = new Appointment(req.body);
  try {
    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// --- Gallery Images ---
router.get('/gallery', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/gallery', async (req, res) => {
  const image = new GalleryImage({ base64String: req.body.base64String });
  try {
    const newImage = await image.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    
    await image.deleteOne();
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Treatment Images ---
router.get('/treatment-images', async (req, res) => {
  try {
    const images = await TreatmentImage.find();
    // Convert array to an object map for frontend ease
    const imageMap = {};
    images.forEach(img => {
      imageMap[img.treatmentName] = img.base64String;
    });
    res.json(imageMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/treatment-images', async (req, res) => {
  try {
    const { treatmentName, base64String } = req.body;
    let image = await TreatmentImage.findOne({ treatmentName });
    if (image) {
      image.base64String = base64String;
      const updatedImage = await image.save();
      res.json(updatedImage);
    } else {
      image = new TreatmentImage({ treatmentName, base64String });
      const newImage = await image.save();
      res.status(201).json(newImage);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/treatment-images/:name', async (req, res) => {
  try {
    const image = await TreatmentImage.findOne({ treatmentName: req.params.name });
    if (!image) return res.status(404).json({ message: 'Image not found' });
    
    await image.deleteOne();
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
