const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
