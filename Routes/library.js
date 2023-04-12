const express = require("express");
const router = express.Router();
const Video = require("../Models/Video");
const History = require("../Models/history");
const LikedVideos = require("../Models/likedVideos");
const WatchLater = require("../Models/watchLater");
const User = require("../Models/User");
//API to get All videos
router.get("/:id/library", async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await User.findById(id);
    res.send(userData);
  } catch (error) {
    res.status(500).json({ Error: `${error}` });
  }
});

//API to Add a videoto History Collection
router.post("/:userId/add/history", async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      title,
      thumbnail,
      channelTitle,
      channelId,
      views,
      likes,
      uploadedAt,
      description,
      videoId,
    } = req.body;
    const isVideo = await History.findOne({ videoId: videoId });
    if (isVideo && userId === isVideo.user.toString()) {
      return res.status(403).send({ Message: "Video found Already" });
    }

    const createHistory = new History({
      videoId,
      title,
      thumbnail,
      channelTitle,
      channelId,
      views,
      likes,
      uploadedAt,
      description,
      user: userId,
    });
    await createHistory.save();
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { history: createHistory._id } },
      { new: true }
    );
    res.status(201).json({ Message: "Video Saved Suceesfully", createHistory });
  } catch (error) {
    res.status(500).json({ Error: `${error}` });
  }
});

//API to Add a videoto Liked Videos Collection
router.post("/:userId/add/likedvideos", async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      title,
      thumbnail,
      channelTitle,
      channelId,
      views,
      likes,
      uploadedAt,
      description,
      videoId,
    } = req.body;
    const isVideo = await LikedVideos.findOne({ videoId: videoId });
    if (isVideo && userId === isVideo.user.toString()) {
      return res.status(403).send({ Message: "Video found Already" });
    }

    const createLikedVideo = new LikedVideos({
      videoId,
      title,
      thumbnail,
      channelTitle,
      channelId,
      views,
      likes,
      uploadedAt,
      description,
      user: userId,
    });
    await createLikedVideo.save();
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { likedVideos: createLikedVideo._id } },
      { new: true }
    );
    res
      .status(201)
      .json({ Message: "Video Saved Suceesfully", createLikedVideo });
  } catch (error) {
    res.status(500).json({ Error: `${error}` });
  }
});

//API to Add a videoto WatchLater  Collection
router.post("/:userId/add/watchlater", async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      title,
      thumbnail,
      channelTitle,
      channelId,
      views,
      likes,
      uploadedAt,
      description,
      videoId,
    } = req.body;
    const isVideo = await WatchLater.findOne({ videoId: videoId });
    if (isVideo && userId === isVideo.user.toString()) {
      return res.status(403).send({ Message: "Video found Already" });
    }

    const createWatchLater = new WatchLater({
      videoId,
      title,
      thumbnail,
      channelTitle,
      channelId,
      views,
      likes,
      uploadedAt,
      description,
      user: userId,
    });
    await createWatchLater.save();
    // Update user collection with history object ID
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { watchLater: createWatchLater._id } },
      { new: true }
    );
    res
      .status(201)
      .json({ Message: "Video Saved Suceesfully", createWatchLater });
  } catch (error) {
    res.status(500).json({ Error: `${error}` });
  }
});

module.exports = router;
