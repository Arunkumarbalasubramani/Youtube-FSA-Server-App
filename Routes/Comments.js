const express = require("express");
const { default: Comments } = require("../Models/Comments");
const { default: Video } = require("../Models/Video");
const verifyToken = require("./verify-token");

const router = express.Router();

//add Comments by VideoId
router.post("/user/video/:videoId", verifyToken, async (req, res) => {
  const newComment = new Comments({ ...req.body, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).send("Comment Saved ");
  } catch (error) {
    res.status(500).send({ Message: "Internal Server Error" });
  }
});
//get Comments by VideoId
router.get("/video/:videoId", verifyToken, async (req, res) => {
  try {
    const comments = await Comments.find({ videoId: req.params.videoId });
    res.send(200).json(comments);
  } catch (error) {
    res.status(500).send({ Message: "Internal Server Error" });
  }
});
//delete Comments by VideoId
router.post("/user/video/:videoId", verifyToken, async (req, res) => {
  try {
    const comment = await Comments.findById(req.params.id);
    const video = await Video.findById(req.params.id);
    if (req.user.id === comment.userId || req.user.id === Video.userId) {
      res.status(200).send({ Message: "The comment has been deleted" });
    } else {
      res.status(403).send({ Message: "You Can Delete only Your Comments" });
    }
  } catch (error) {
    res.status(500).send({ Message: "Internal Server Error" });
  }
});
module.exports = router;
