const mongoose = require("mongoose");

const connectDb = (CONNECTION_STRING) => {
  mongoose
    .connect(CONNECTION_STRING)
    .then((conn) => {
      console.log(
        `Database connection successfull on link : ${CONNECTION_STRING}`
      );
    })
    .catch((err) => {
      console.log("There was a problem while connecting to the database", err);
    });
};

module.exports = connectDb;
