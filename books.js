
require("dotenv").config();
const mongoose = require("mongoose");

// ==================== CONNECT TO MONGODB ATLAS ====================

// mongoose.connect() connects our Node.js application to MongoDB Atlas.
// process.env.MONGODB_URL reads the connection string from the .env file.
// .then() executes when the connection is successful.
// .catch() handles connection errors.

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("MongoDB Atlas connected successfully");
})
.catch((err) => {
    console.log("Connection error:", err.message);
});


// ==================== SCHEMA AND VALIDATION ====================

// A Schema defines the structure of documents in a MongoDB collection.
// It specifies field names, data types, default values, and validation rules.
// Mongoose validates documents against the schema before saving them.

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        // required: true means the title must be provided.
        // If the title is missing, Mongoose generates a ValidationError.
        required: true,
    },
    author: {
        type: String,
        // This field is optional because required is not specified.
    },
    price: {
        type: Number,
        // min sets the minimum allowed value for the price.
        // If price is less than 1, validation fails.
        min: [1, "please enter a valid price"],
    },
    discount: {
        type: Number,
        // default supplies a value when discount is not provided.
        // Here, the default discount is 0.
        default: 0,
    },
    genre: [String],
    // An array of strings can store multiple genres.
    // Example: ["comics", "superhero"]

    category: {
        type: String,
        // enum restricts the field to predefined values.
        // Only "fiction" and "non-fiction" are accepted.
        enum: ["fiction", "non-fiction"],
    },
});


// ==================== CREATE MODEL ====================

// mongoose.model() creates a Model using the schema.
// A Model provides methods to perform CRUD operations:
// Create, Read, Update, and Delete.
// Mongoose uses the model name "Book" to determine the collection name.

const Book = mongoose.model("Book", bookSchema);


// ==================== INSERT AND UPDATE A DOCUMENT ====================
// Create a new document using the Book model.
// The document is not saved to MongoDB until save() is called.

let book1 = new Book({
    title: "Marvel comics",
    price: 500,
    category: "fiction",
});

// save() validates the document against the schema
// and inserts it into MongoDB if validation succeeds.
// The update is performed inside the save() promise chain.
// This ensures the insertion finishes before the update begins.

book1.save()
.then((res) => {
    console.log("Book saved successfully:", res);

    // ==================== VALIDATION DURING UPDATION ====================

    // updateOne() updates the first document matching the filter.
    // The filter searches for a book with the title "Marvel comics".
    //
    // $set changes only the specified field.
    // Here, we attempt to set the price to 0.
    //
    // runValidators: true enables supported schema validators
    // during the update operation.
    //
    // Since the schema specifies min: 1, price: 0 fails validation.
    // Therefore, the update should be rejected.

    return Book.updateOne(
        { _id: res._id },
        { $set: { price: 0 } },
        { runValidators: true }
    );
})
.then((res) => {
    // Executes if the update succeeds.
    console.log("Update result:", res);
})
.catch((err) => {
    // ==================== HANDLING ERRORS ====================

    // ValidationError:
    // A document fails a schema validation rule.

    if (err.name === "ValidationError") {
        console.log("Validation error:", err.message);
    }

    // CastError:
    // Mongoose cannot convert a value to the required data type.
    else if (err.name === "CastError") {
        console.log("Cast error:", err.message);
    }

    // MongoServerError:
    // MongoDB returns a server-side error.
    else if (err.name === "MongoServerError") {
        console.log("MongoDB server error:", err.message);
    }

    // Handles other errors, including errors from saving or updating.
    else {
        console.log("Error:", err.message);
    }
});



