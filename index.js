require("dotenv").config();
const mongoose = require("mongoose");

// ==================== CONNECT TO MONGODB ATLAS ====================

// mongoose.connect() connects our Node.js application to MongoDB Atlas.
// process.env.MONGODB_URL reads the connection string from the .env file.
// .then() executes when the connection is successful.
// .catch() handles connection errors such as invalid credentials or network issues.

mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log("MongoDB Atlas connected successfully");

    // ==================== CREATE SCHEMA ====================
    // A Schema defines the structure of documents in a collection.
    // It specifies field names and their data types.
    // String stores text, while Number stores numeric values.

    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      age: Number,
    });

    // ==================== CREATE MODEL ====================
    // A Model is created using a schema.
    // It provides methods to perform CRUD operations:
    // Create, Read, Update, and Delete.
    //
    // Mongoose uses the model name "User" to determine the collection name.

    const User = mongoose.model("User", userSchema);

    // ==================== INSERT ONE DOCUMENT ====================
    // new User() creates a document in memory.
    // save() validates and saves the document to MongoDB.
    // It returns a Promise that resolves with the saved document.

    const user1 = new User({
      name: "Adam",
      email: "adam@yahoo.in",
      age: 48,
    });

    try {
      const res = await user1.save();

      console.log("User saved successfully");
      console.log(res);
    } catch (err) {
      // Handles errors that occur while saving the document.
      console.log("Error saving user:", err.message);
    }

    // ==================== INSERT MANY DOCUMENTS ====================
    // insertMany() inserts multiple documents using an array of objects.
    // It returns a Promise that resolves with the inserted documents.

    try {
      const res = await User.insertMany([
        { name: "Tony", email: "tony@gmail.com", age: 50 },
        { name: "Peter", email: "peter@gmail.com", age: 30 },
        { name: "Bruce", email: "bruce@gmail.com", age: 47 },
      ]);

      console.log("Users inserted successfully");
      console.log(res);
    } catch (err) {
      console.log("Error inserting users:", err.message);
    }

    // ==================== FIND DOCUMENTS ====================
    // find() returns an array of all documents matching the condition.
    // If no documents match, it returns an empty array.
    //
    // $gt means "greater than".
    // This query finds users whose age is greater than 47.

    try {
      const res = await User.find({ age: { $gt: 47 } });
      console.log(res);
    } catch (err) {
      console.log("Find error:", err.message);
    }

    // ==================== FIND ONE DOCUMENT ====================
    // findOne() returns the first document matching the condition.
    // It returns one document or null if no document matches.
    //
    // Here, we find the first user whose age is greater than 47.

    try {
      const res = await User.findOne({ age: { $gt: 47 } });
      console.log(res);
    } catch (err) {
      console.log("FindOne error:", err.message);
    }

    // ==================== FIND DOCUMENT BY ID ====================
    // findById() searches for a document using its MongoDB _id.
    // MongoDB automatically generates an _id for each document.
    //
    // Pass the ID directly as a string.
    // Replace this example ID with an actual ID from your database.
    //
    // A valid ID with no matching document returns null.

    try {
      const res = await User.findById("6ad640e9766fb23cea15802f");
      console.log(res);
    } catch (err) {
      console.log("FindById error:", err.message);
    }

    // ==================== UPDATE ONE DOCUMENT ====================
    // updateOne() updates the first document matching the filter.
    //
    // First object: identifies the document.
    // Second object: specifies the changes.
    //
    // Here, the user's name changes from "Adam" to "Remo".
    // The update result contains information such as matchedCount
    // and modifiedCount, rather than the updated document.

    try {
      const res = await User.updateOne(
        { name: "Adam" },
        { $set: { name: "Remo" } },
      );

      console.log(res);
    } catch (err) {
      console.log("UpdateOne error:", err.message);
    }

    // ==================== UPDATE MANY DOCUMENTS ====================
    // updateMany() updates all documents matching the filter.
    //
    // $gt: 48 selects users whose age is greater than 48.
    // $set changes their age to 55.
    //
    // Users aged exactly 48 are NOT selected by this condition.

    try {
      const res = await User.updateMany(
        { age: { $gt: 48 } },
        { $set: { age: 55 } },
      );

      console.log(res);
    } catch (err) {
      console.log("UpdateMany error:", err.message);
    }

    // ==================== FIND ONE AND UPDATE ====================
    // findOneAndUpdate() finds one matching document and updates it.
    //
    // First object: finds the user named "Remo".
    // Second object: changes the user's age to 50.
    // { new: true } returns the updated document.
    //
    // If no user matches the filter, the result is null.

    try {
      const res = await User.findOneAndUpdate(
        { name: "Remo" },
        { $set: { age: 50 } },
        { new: true },
      );

      console.log(res);
    } catch (err) {
      console.log("FindOneAndUpdate error:", err.message);
    }

    // ==================== DELETE ONE DOCUMENT ====================
    // deleteOne() deletes the first document matching the filter.
    //
    // Here, the first user named "Remo" is deleted.
    // The result contains deletedCount:
    // 1 means a document was deleted; 0 means no document matched.
    //
    // IMPORTANT: This permanently deletes the matched document.

    try {
      const res = await User.deleteOne({ name: "Remo" });
      console.log(res);
    } catch (err) {
      console.log("Delete error:", err.message);
    }

    // ==================== CLOSE DATABASE CONNECTION ====================
    // close() disconnects the application from MongoDB Atlas
    // after all the operations above have finished.

    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  })
  .catch((err) => {
    // Handles connection errors.
    console.log("Connection error:", err.message);
  });
