const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

// Create a contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (name == undefined || email == undefined) {
      return res
        .status(400)
        .send({ success: false, message: 'Missing parameters' });
    }
    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();

    const mailOptions = {
      from: 'hello@astrix.live',
      to: email,
      subject: 'Welcome to Astrix',
      text: `Hello ${name},\n\nThank you for contacting us! Your information has been successfully added.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json(newContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a contact by email
router.put('/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Validate email and username
    // Add your validation logic here

    const updatedContact = await Contact.findOneAndUpdate(
      { email },
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(updatedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(deletedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
