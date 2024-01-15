const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',                  // hostname
  service: 'outlook',                          // service name
  secureConnection: false,
  tls: {
      ciphers: 'SSLv3'                         // tls version
  },
  port: 587 || 465 || 5 || 2,                  // port
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASS
  }
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

    let contact = await Contact.findOne({email: email});
    if (contact){
      return res.status(400).json({error: "Contact already exists with given email"});
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
      subject: 'Thank you for joining the Astrix Waitlist',
      html: `<!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Astrix Waitlist</title>
      </head>
      
      <body style="font-family: Arial, sans-serif;">
      
        <p>Thank you for your interest in Astrix. We're thrilled to have you on board and appreciate your enthusiasm for making events seamless and more engaging.</p>
      
        <p>By joining our waitlist, you've taken the first step in being a part of a revolution in event ticketing. Astrix is committed to redefining the live event experience, and we can't wait to share our innovative features and exciting updates with you.</p>
      
        <p>Stay tuned for the latest news, announcements, and exclusive sneak peeks into the world of Astrix. We're working diligently behind the scenes to bring you a ticketing platform that will transform the way you experience live events.</p>
      
        <p>As a valued member of our waitlist, you'll be among the first to:</p>
      
        <ol>
          <li>Receive updates on our official launch date.</li>
          <li>Gain access to exclusive pre-launch offers and promotions.</li>
          <li>You will be the first to explore Astrix's cutting-edge features and benefits.</li>
        </ol>
      
        <p>In the meantime, don't hesitate to reach out if you have any questions or feedback. Your input is invaluable as we continue to refine and enhance Astrix to meet your needs and expectations.</p>
      
        <p>Thank you once again for your interest and support. We can't wait to embark on this exciting journey together.</p>
      
        <p>Stay tuned for the future of event ticketing with Astrix!</p>
      
        <p>- Astrix Team</p>
      
      </body>
      
      </html>`,
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
