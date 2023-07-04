use ra-dating; // Switch to the appropriate database

// Find a user by ID
const userId = ObjectId("64997f1378892faf027fbf8a"); // Replace with the desired user ID
const user = db.users.findOne({ _id: userId });

if (user) {
  // User found
  printjson(user);
} else {
  // User not found
  print("User not found");
}
