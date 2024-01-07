const MongoClient = require("mongodb").MongoClient;
const dboper = require("./operations");

const url = "mongodb://localhost:27017/";
const dbname = "nucampsite";

let db;
let client; // Declare client at the outer scope

MongoClient.connect(url, { useUnifiedTopology: true })
  .then((connectedClient) => {
    console.log("Connected correctly to server");
    client = connectedClient; // Assign the connected client to the outer client variable

    db = client.db(dbname);

    // Drop collection
    return db.dropCollection("campsites").catch((err) => {
      console.log("No collection to drop");
    });
  })
  .then(() => {
    // Insert document
    return dboper.insertDocument(
      db,
      { name: "Breadcrumb Trail Campground", description: "Test" },
      "campsites"
    );
  })
  .then((result) => {
    console.log("Insert Document:", result.ops);

    // Find documents
    return dboper.findDocuments(db, "campsites");
  })
  .then((docs) => {
    console.log("Found Documents:", docs);

    // Update document
    return dboper.updateDocument(
      db,
      { name: "Breadcrumb Trail Campground" },
      { description: "Updated Test Description" },
      "campsites"
    );
  })
  .then((result) => {
    if (result && result.result) {
      console.log("Updated Document Count:", result.result.nModified);
    } else {
      console.log("Error: Unable to get updated document count.");
    }

    // Find documents
    return dboper.findDocuments(db, "campsites");
  })
  .then((docs) => {
    console.log("Found Documents:", docs);

    // Remove document
    return dboper.removeDocument(
      db,
      { name: "Breadcrumb Trail Campground" },
      "campsites"
    );
  })
  .then((result) => {
    console.log("Deleted Document Count:", result.deletedCount);

    // Close the connection
    return client.close();
  })
  .catch((err) => {
    console.log(err);
    if (client) {
      client.close(); // Close the MongoDB client in case of an error
    }
  });
