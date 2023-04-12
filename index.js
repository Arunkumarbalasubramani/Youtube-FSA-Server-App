const express = require("express");
const mongoose = require("mongoose");
const dbConnection = require("./Monogoconnection/Connection.js");
const userRoutes = require("./Routes/User.js");
const commentRoutes = require("./Routes/Comments.js");
const authRoutes = require("./Routes/auth.js");
const libRoutes = require("./Routes/library.js");
const cookieParsor = require("cookie-parser");
require("dotenv").config();
mongoose.set("strictQuery", true);
const app = express();
dbConnection();

const PORT = process.env.PORT || 4000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to YouTube App");
});
app.use(cookieParsor());
app.use(authRoutes);
app.use(userRoutes);
app.use(commentRoutes);
app.use(libRoutes);

app.listen(PORT, () => {
  console.log(`App Started and Listening to ${PORT}`);
});
