require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const contactRoutes = require("./routes/contact");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const mongoConnectURL = process.env.MONGO_URL;

// Middleware
app.use(cors())
app.use(bodyParser.json());

// Routes
app.use('/contacts', contactRoutes);


const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(`${mongoConnectURL}`) 
        console.log('Mongo connected')
    } catch(error) {
        console.log(error)
        process.exit()
    }
}
// Start the server
app.listen(PORT, async() => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
