const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log("Mongo DB Is now Connected 😊");
  } catch (error) {
    console.log(`Error While Connecting to DB :${error}`);
  }
};
module.exports = dbConnection;
