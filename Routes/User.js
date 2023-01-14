const express = require("express");
const verifyToken = require("./verify-token");
const User = require("../Models/User");
const {
  updateUser,
  deleteUser,
  getUser,
  subscribe,
  unSubscribe,
} = require("./user-helper");
const router = express.Router();

//update
router.put("/user/:id", verifyToken, updateUser);

//delete
router.delete("/user/:id", verifyToken, deleteUser);

// getUser
router.get("/user/find/:id", getUser);

//subscribe
router.put("/user/subscribe/:id", verifyToken, subscribe);

//unsubscribe
router.put("/user/unsubscribe/:id", verifyToken, unSubscribe);

//histort
router.get("/user/history/:", verifyToken, (req, res) => {
  res.send("it is working");
});

//watchLater
router.get("/user/test", verifyToken, (req, res) => {
  res.send("it is working");
});

//like
router.put("/user/:videoId", verifyToken, (req, res) => {
  res.send("it is working");
});
//dislike

router.put("/users/like/:videoId", (req, res) => {
  res.send("it is working");
});
module.exports = router;
