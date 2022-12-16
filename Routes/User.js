const express = require("express");
const verifyToken = require("./verify-token");
const User = require("../Models/User");
const { updateUser, deleteUser, getUser, subscribe } = require("./user-helper");
const router = express.Router();

//update
router.put("/users/:id", verifyToken, updateUser);

//delete
router.delete("/users/:id", verifyToken, deleteUser);

// getUser
router.get("/users/find/:id", getUser);

//subscribe
router.put("/users/subscribe/:id", verifyToken, subscribe);

//unsubscribe
router.put("/users/unsubscribe/:id", verifyToken, (req, res) => {
  res.send("it is working");
});

//histort
router.get("/users/history/:", verifyToken, (req, res) => {
  res.send("it is working");
});

//watchLater
router.get("/users/test", verifyToken, (req, res) => {
  res.send("it is working");
});

//like
router.put("/users/like/:videoId", verifyToken, (req, res) => {
  res.send("it is working");
});
//dislike

router.put("/users/like/:videoId", (req, res) => {
  res.send("it is working");
});
module.exports = router;
