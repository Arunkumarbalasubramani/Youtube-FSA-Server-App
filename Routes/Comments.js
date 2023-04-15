const express = require("express");
const User = require("../Models/User");
const verifyToken = require("./verify-token");
const Comments = require("../Models/Comments");
const mongoose = require("mongoose");
const router = express.Router();

//add Comments by VideoId
router.post("/:userId/comment/:videoId", async (req, res) => {
  try {
    const { userId, videoId } = req.params;
    const { commentText } = req.body;

    const userData = await User.findById(userId);
    if (!userData) return res.status(404).json({ Error: "User not found" });

    const validUserId = mongoose.Types.ObjectId(userId);

    // check if the user has already commented for this video
    const existingComment = await Comments.findOne({
      userId: validUserId,
      videoId,
    });
    if (existingComment) {
      return res
        .status(400)
        .json({ Error: "You have already commented on this video" });
    }

    const newComment = new Comments({
      userId: validUserId,
      videoId,
      commentText,
    });

    await newComment.save();
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $push: { comments: newComment._id } },
      { new: true }
    );
    await updateUser.save();
    res.status(201).json({ Message: "Comment saved succesfully" });
  } catch (error) {
    res.status(500).send({ Error: `${error}` });
  }
});

//get Comments by VideoId
router.get("/:userId/:videoId/getcomment", async (req, res) => {
  try {
    const { videoId, userId } = req.params;
    const validUserId = mongoose.Types.ObjectId(userId);
    if (!validUserId) {
      throw new Error("Invalid userId");
    }
    const comments = await Comments.find({ videoId, userId: validUserId })
      .populate({
        path: "userId",
        select: "name",
      })
      .exec();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).send({ Error: `${error}` });
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
