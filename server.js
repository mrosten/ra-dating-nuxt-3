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
app.delete('/users/:_id', async (req, res) => {
  try {
    const userId = req.params._id;

    const db = client.db("ra-dating"); // Get the default database
    const usersCollection = db.collection('users'); // Access the 'users' collection
    const matchesCollection = db.collection('matches'); // Access the 'matches' collection

    const { ObjectId } = require('mongodb');

    // Find the user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user from the 'users' collection
    const deleteUserResult = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

    if (deleteUserResult.deletedCount === 1) {
      // Delete any associated match IDs from the 'matches' collection and update the users' 'matches' arrays
      await matchesCollection.deleteMany({
        $or: [
          { user1Id: new ObjectId(userId) },
          { user2Id: new ObjectId(userId) }
        ]
      });

      await usersCollection.updateMany(
        { _id: { $ne: new ObjectId(userId) } },
        { $pull: { matches: new ObjectId(userId) } }
      );

      logger.info(`User with ID ${userId} and associated matches deleted successfully`);
      res.status(200).json({ message: 'User and associated matches deleted successfully' });
    } else {
      logger.info(`User with ID ${userId} not found`);
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


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
      { returnOriginal: false }
    );

    logger.info('Document updated:', result);
    res.status(200).json({ message: 'Document updated successfully' });
  } catch (error) {
    logger.info('Error updating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Get Routs
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.get('/api/fillindata', async (req, res) => {
  try {
    const db = client.db("ra-dating"); // Get the default database
    const usersCollection = db.collection('users'); // Access the 'users' collection

    const users = await usersCollection.find().toArray();

    // Iterate over each user and update missing gender and date of birth fields
    for (const user of users) {
      if (!user.gender) {
        // Assign random gender (male or female)
        user.gender = Math.random() < 0.5 ? 'male' : 'female';
      }
      if (!user.dob.month || !user.dob.day || !user.dob.year) {
        // Generate random date of birth between 1970 and 2020
        const year = Math.floor(Math.random() * (2021 - 1970)) + 1970;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1; // Assuming all months have 28 days for simplicity

        user.dob = {
          month: month.toString(),
          day: day.toString(),
          year: year.toString()
        };
      }

      // Update the user record in the collection
      await usersCollection.updateOne({ _id: user._id }, { $set: user });
    }

    res.status(200).json({ message: 'Data filled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/matchallmaleusers', async (req, res) => {
  try {
    const db = client.db("ra-dating"); // Get the default database
    const usersCollection = db.collection('users'); // Access the 'users' collection
    const matchesCollection = db.collection('matches'); // Access the 'matches' collection

    // Find all matchless male users
    const matchlessMales = await usersCollection.find({
      gender: 'male', // Replace 'male' with the desired gender
      matches: { $size: 0 } // Find users with an empty 'matches' array
    }).toArray();

    if (matchlessMales.length === 0) {
      return res.status(404).json({ error: 'No available matchless male users found' });
    }

    let matchlessFemales = await usersCollection.find({
      gender: 'female', // Replace 'female' with the desired gender
      matches: { $size: 0 } // Find users with an empty 'matches' array
    }).toArray();

    if (matchlessFemales.length === 0) {
      return res.status(404).json({ error: 'No available matchless female users found' });
    }

    // Assign matches to matchless male users until there are no more matchless females
    for (const maleUser of matchlessMales) {
      // Select a random female user as a match
      const randomIndex = Math.floor(Math.random() * matchlessFemales.length);
      const femaleUser = matchlessFemales[randomIndex];

      // Create a new match entry
      const newMatch = {
        user1Id: maleUser._id,
        user2Id: femaleUser._id,
        matchedOn: new Date()
      };

      // Insert the match entry into the 'matches' collection
      const insertedMatch = await matchesCollection.insertOne(newMatch);

      // Update the 'matches' array field of both users
      await usersCollection.updateOne(
        { _id: maleUser._id },
        { $push: { matches: insertedMatch.insertedId } }
      );

      await usersCollection.updateOne(
        { _id: femaleUser._id },
        { $push: { matches: insertedMatch.insertedId } }
      );

      // Remove the matched female user from the array
      matchlessFemales.splice(randomIndex, 1);

      if (matchlessFemales.length === 0) {
        break; // Break the loop if there are no more matchless females
      }
    }

    res.status(200).json({ message: 'Users matched successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/assignmatch', async (req, res) => {
  try {

    const db = client.db("ra-dating"); // Get the default database
    const usersCollection = db.collection('users'); // Access the 'users' collection
    const matchesCollection = db.collection('matches'); // Access the 'matches' collection
    
    logger.info('Match request received', { requestBody: req.body });

    const { user1Id, user2Id } = req.body;
    // console.log(user1Id, user2Id);

    // logger.info("userid: " + req.body.user1Id);
    // Find both users by their IDs

    logger.info(JSON.stringify(user1Id) + " " + user2Id);
    const user1 = await usersCollection.findOne({ "_id": new ObjectId(user1Id) });

    logger.info(user1);

    const user2 = await usersCollection.findOne({ "_id": new ObjectId(user2Id) });

    logger.info(user2);

    if (!user1 || !user2) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    // Create a new match entry
    const newMatch = {
      user1Id,
      user2Id,
      matchedOn: new Date()
    };

    // Insert the match entry into the 'matches' collection
    const insertedMatch = await matchesCollection.insertOne(newMatch);

    // Update the matches field of both users
    await usersCollection.updateOne(
      { _id: new ObjectId(user1Id) },
      { $push: { matches: insertedMatch.insertedId } }
    );

    await usersCollection.updateOne(
      { _id: new ObjectId(user2Id) },
      { $push: { matches: insertedMatch.insertedId } }
    );

    res.status(200).json({ message: 'Match assigned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/abcde', async (req, res) => {
  logger.info("HI");
  res.status(200).json({ hello: "HI" });
});


app.get('/api/userMatches/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const usersCollection = client.db("ra-dating").collection('users');
    const matchesCollection = client.db("ra-dating").collection('matches');

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userMatches = await matchesCollection.find({
      _id: { $in: user.matches }
    }).toArray();

    const users = [];

    for (const match of userMatches) {
      const otherUserId = match.user1Id == user._id ? match.user2Id : match.user1Id;

      const otherUser = await usersCollection.findOne({ _id: new ObjectId(otherUserId) });

      if (otherUser) {
        users.push(otherUser);
      }
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.delete('/api/matches/:matchId', async (req, res) => {
  try {
    const matchId = req.params.matchId;

    const db = client.db("ra-dating"); // Get the default database
    const usersCollection = db.collection('users'); // Access the 'users' collection
    const matchesCollection = db.collection('matches'); // Access the 'matches' collection

    // Find the match by its ID
    const match = await matchesCollection.findOne({ _id: matchId });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Delete the match from the 'matches' collection
    await matchesCollection.deleteOne({ _id: matchId });

    // Delete the match ID from the 'matches' array field of both users
    await usersCollection.updateMany(
      { _id: { $in: [match.user1Id, match.user2Id] } },
      { $pull: { matches: matchId } }
    );

    res.status(200).json({ message: 'Match deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
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

  // logger.info("request userid: " + req.body.userID);

  try {
    const userId = req.body.userID;
    const picturePath = path.join(__dirname, 'profilePics', userId, req.file.originalname);

    // Create the directory if it doesn't exist
    const directoryPath = path.join(__dirname, 'profilePics', userId);
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    logger.info("about to write to the picture path: " + picturePath);
    await fs.promises.writeFile(picturePath, req.file.buffer);

    logger.info('File stored successfully');
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.info('Error:');
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

    const { name, username, email, password, dob, gender } = req.body;
    logger.info('Received variables:', { name, username, email, password, dob, gender });


    const db = client.db("ra-dating");
    const usersCollection = db.collection('users');

    logger.info('1');
    const result = await usersCollection.insertOne({
      username: username,
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
  } catch (err) {
    logger.info('Error inserting document:', err);
    res.status(500).send('Error inserting document');
  }
});



app.post('/login', async (req, res) => {
  logger.info("Login request received");

  // ... rest of the code ...

  const { _id, password } = req.body;

  try {
    const db = client.db("ra-dating"); // Get the default database
    const usersCollection = db.collection('users'); // Create or access the 'users' collection


    const user = await usersCollection.findOne({ _id: new ObjectId(_id) });

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