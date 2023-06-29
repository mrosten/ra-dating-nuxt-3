const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const winston = require('winston');
const { ObjectId } = require('mongodb');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const fs = require('fs');
const path = require('path');


const multer = require('multer');

const storage = multer.memoryStorage(); // Use memory storage for handling file uploads

const upload = multer({ storage });


const app = express();

const debugMode = process.env.DEBUG_MODE === 'true';


// Create a Winston logger instance 
const logger = winston.createLogger({
  level: 'info', // Set the log level (e.g., 'info', 'debug', 'error')
  format: winston.format.combine(
    winston.format.timestamp(), // Include timestamp in log messages
    winston.format.simple() // Use a simple log format
  ),
  transports: [
    new winston.transports.Console(), // Output logs to the console
    new winston.transports.File({ filename: 'logs.txt' }) // Output logs to a file
  ]
}); 

// Middleware
app.use(cors());
app.use(bodyParser.json());

const mongoURI = "mongodb+srv://mrosten:ntptez@cluster0.nzxelpi.mongodb.net/";

const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function startServer() {
  try {
    // Connect to the database
    logger.info('Connecting to the database');
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    logger.info('Connected to the database');

    // try {
    //   logger.info('1');
    //   const result = await client.db("ra-dating").collection('users').insertOne({
    //     username: "boo",
    //     email: "boo@boo.boo",
    //     password: "password",
    //     dob: "08/08/1979",
    //     gender: "m",
    //     profileInfo: "Some profile information",
    //     role: "user"
    //   });
    //   logger.info('2');
    // } catch (err) {
    //   logger.info('Error inserting document:', err);
    //   return res.status(500).send('Error inserting document');
    // }
        

    

    // Start the server after successful database connection
    app.listen(4000, () => {
      logger.info('Server running on http://localhost:4000');
    });
  } catch (err) {
    logger.error('Error connecting to the database:', err);
    logger.error('The Express server will continue running, but there may be issues accessing the database.');
  } finally {
    // await client.close();
  }
}

startServer();


// Patch Routes
app.patch('/users/:_id', async (req, res) => {
  try {
    const userId = req.params._id;
    const updatedData = req.body;

    const db = client.db("ra-dating"); // Get the default database
    const usersCollection = db.collection('users'); // Access the 'users' collection

    logger.info("db=" + db);
    logger.info("beginning of patch userId = " + userId + " updatedData = " + updatedData);

    const b = new ObjectId(userId);
    const result = await usersCollection.updateOne(
      { _id: b }, // Filter based on the user ID
      { $set: updatedData }, // Update the fields with the new data
      { returnOriginal: false}
    );

    logger.info('Document updated:', result);
    res.status(200).json({ message: 'Document updated successfully' });
  } catch (error) {
    logger.info('Error updating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/users/:_id', async (req, res) => {
  try {
    const userId = req.params._id;

    const db = client.db("ra-dating"); // Get the default database
    const usersCollection = db.collection('users'); // Access the 'users' collection

    // logger.info("db=" + db);
    // logger.info("tryin to delete");

    // logger.info('Document updated:', result);
    // res.status(200).json({ message: 'Document updated successfully' });
  } catch (error) {
    // logger.info('Error updating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get Routs
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});



app.get('/api/users', async (req, res) => {
  try {
    const db = client.db("ra-dating"); // Get the default database
    const usersCollection = db.collection('users'); // Access the 'users' collection

    const users = await usersCollection.find().toArray();
    const modifiedUsers = users.map(user => ({
      ...user,
      editing: false,
    }));
    // logger.info("users:", users);

    if (users.length === 0) {
      logger.info("No users found");
    }

    res.send(modifiedUsers);
  } catch (err) {
    logger.error('Error retrieving users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Posts Routes


app.post('/api/uploadProfilePicture', upload.single('profilePicture'), async (req, res) => {
  // Check if a file was provided
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
 
  console.log('1');
  // console.dir(res, { depth: null });

  // return;

  logger.info("request userid: " + req.body.userID);

  try {
    const userId = req.body.userID;
    const picturePath = path.join(__dirname, 'profilePics', userId, req.file.originalname);

    // Create the directory if it doesn't exist
    const directoryPath = path.join(__dirname, 'profilePics', userId);
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    await fs.promises.writeFile(picturePath, req.file.buffer);

    console.log('File stored successfully');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({ error: 'Failed to save file' });
  }
});

app.post('/logger', async (req, res) => {
  try {
    const logMessage = req.body.message; // Assuming the log message is sent in the request body

    // Add your custom logging logic here
    // This can include writing the log to a file, storing it in a database, or sending it to a logging service

    logger.info(logMessage); // Example: Log the message to the console

    return res.status(200).json({ success: true });
  } catch (error) {
    logger.info('Error:' + error);
    return res.status(500).json({ error: 'Failed to create log entry' });
  }
});


app.post('/signup', async (req, res) => {
  try {
    logger.info('Signup request received', { requestBody: req.body });

    const { name, email, password, dob, gender } = req.body;
    const db = client.db("ra-dating"); 
    const usersCollection = db.collection('users'); 

    logger.info('1');
    const result = await usersCollection.insertOne({
      username: email,
      email: email,
      password: password,
      dob: dob,
      gender: gender,
      profileInfo: "Some profile information",
      role: "user"
    });
    
    logger.info('2');
    const insertedId = result.insertedId; // Retrieve the inserted document id

    logger.info('Document inserted:', insertedId);
    logger.info('User registered successfully - id = ' + insertedId);

    res.status(200).send({ message: 'User registered successfully', userId: insertedId });
  } catch(err) {
    logger.info('Error inserting document:', err);
    res.status(500).send('Error inserting document');
  }
});



app.post('/login', async (req, res) => {
  logger.info("Login request received");

  // ... rest of the code ...

  const { email, password } = req.body;

  try {
    const db = client.db("ra-dating"); // Get the default database
    const usersCollection = db.collection('users'); // Create or access the 'users' collection


    const user = await usersCollection.findOne({ email: email, password: password });

    console.log("After findOne");

    if (user) {
      logger.info('User found:', user);
      // User found, you can proceed with the login logic here
      // For example, you can generate a token and send it in the response
      return res.status(200).json({ message: 'Login successful', token: 'your_token_here' });
    } else {
      logger.info('User not found');
      // User not found, you can send an appropriate error response
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    logger.info('Error finding user:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
