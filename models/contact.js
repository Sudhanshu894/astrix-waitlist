const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique:true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
  subscribe: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
