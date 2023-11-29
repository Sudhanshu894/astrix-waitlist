const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// Create a contact
router.post('/', async (req, res) => {
  try {
    const { email, username, phoneNumber } = req.body;

    // Validate email and username
    // Add your validation logic here
    if (email == undefined || username == undefined){
        return res.status(300).send({success: false, message: "Missing parameters"});
    }
    const existing = await Contact.findOne({email});
    if (existing){
        return res.status(400).send({success: false, message: "Contact with this info already exists"});
    }

    const newContact = new Contact({
      email,
      username,
      phoneNumber,
    });

    await newContact.save();
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
