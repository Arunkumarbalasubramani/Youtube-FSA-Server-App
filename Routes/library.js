const express = require("express");
const router = express.Router();
const Video = require("../Models/Video");
const History = require("../Models/history");
const LikedVideos = require("../Models/likedVideos");
const WatchLater = require("../Models/watchLater");
const User = require("../Models/User");
const Channels = require("../Models/Channels");
const mongoose = require("mongoose");
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

    // const existingHistory = await History.findOne({
    //   videoId: videoId,
    //   user: userId,
    // });
    // if (existingHistory) {
    //   return res.status(403).send({ Message: "Video found Already" });
    // }

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

//API to get All History Videos
router.get("/:userId/history", async (req, res) => {
  try {
    const { userId } = req.params;
    const videoData = await History.find({
      user: userId,
    });
    if (!videoData) return res.status(404).send({ Message: "User not Found" });
    res.status(201).send(videoData);
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
    const existingVideo = await LikedVideos.findOne({
      videoId: videoId,
      user: userId,
    });
    if (existingVideo) {
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

//API to get All LikedVideos Videos
router.get("/:userId/likedvideos", async (req, res) => {
  try {
    const { userId } = req.params;
    const videoData = await LikedVideos.find({
      user: userId,
    });
    if (!videoData) return res.status(404).send({ Message: "User not Found" });
    res.status(201).send(videoData);
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
    const existingVideo = await WatchLater.findOne({
      videoId: videoId,
      user: userId,
    });
    if (existingVideo) {
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

router.get("/:userId/watchlater", async (req, res) => {
  try {
    const { userId } = req.params;
    const videoData = await WatchLater.find({
      user: mongoose.Types.ObjectId(userId),
    });
    if (!videoData) return res.status(404).send({ Message: "User not Found" });
    res.status(201).send(videoData);
  } catch (error) {
    res.status(500).json({ Error: `${error}` });
  }
});

//API to add Subscriptions
router.post("/:userId/add/subscriptions", async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.params.userId);

    const existingSubscription = await Channels.findOne({
      channelId: req.body.channelId,
      user: userId,
    });
    if (existingSubscription) {
      return res.status(403).send({ Message: "Channel Already Subscribed" });
    }
    const addSubscription = new Channels({ ...req.body, user: userId });
    await addSubscription.save();

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { subscribedChannels: addSubscription._id },
      },
      { new: true }
    );
    res
      .status(201)
      .json({ Message: "Channel subscribed", id: addSubscription._id });
  } catch (error) {
    res.status(500).json({ Error: `${error}` });
  }
});

router.get("/:userId/subscriptions", async (req, res) => {
  try {
    const { userId } = req.params;
    const channelData = await Channels.find({
      user: mongoose.Types.ObjectId(userId),
    });
    if (!channelData)
      return res.status(404).send({ Message: "User not Found" });
    res.status(201).send(channelData);
  } catch (error) {
    res.status(500).json({ Error: `${error}` });
  }
});
router.get("/:userId/library", async (req, res) => {
  try {
    const { userId } = req.params;
    const userLibrary = await User.findById(userId)
      .populate({ path: "watchLater" })
      .populate({ path: "likedVideos" })
      .populate({ path: "history" });
    if (!userLibrary)
      return res.status(404).send({ Message: "User not Found" });
    res.status(201).send(userLibrary);
  } catch (error) {
    res.status(500).json({ Error: `${error}` });
  }
});

router.delete("/:userId/likedvideos/delete/:videoId", async (req, res) => {
  try {
    const { userId, videoId } = req.params;
    const videoData = await LikedVideos.findOneAndRemove({
      videoId,
    });
    if (!videoData) return res.status(404).send({ Message: "Video not Found" });
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { likedVideos: videoData._id } },
      { new: true }
    );
    user.save();
    res.status(201).json({ Message: "Video removed Successfully" });
  } catch (error) {
    res.status(500).json({ Error: `${error}` });
  }
});

router.delete("/:userId/watchlater/delete/:videoId", async (req, res) => {
  try {
    const { userId, videoId } = req.params;
    const videoData = await WatchLater.findOneAndRemove({
      videoId,
    });
    if (!videoData) return res.status(404).send({ Message: "Video not Found" });
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { watchLater: videoData._id } },
      { new: true }
    );
    user.save();
    res.status(201).json({ Message: "Video removed Successfully" });
  } catch (error) {
    res.status(500).json({ Error: `${error}` });
  }
});

router.delete("/:userId/history/delete/:videoId", async (req, res) => {
  try {
    const { userId, videoId } = req.params;
    const videoData = await History.findOneAndRemove({
      videoId,
    });
    if (!videoData) return res.status(404).send({ Message: "Video not Found" });
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { history: videoData._id } },
      { new: true }
    );
    user.save();
    res.status(201).json({ Message: "Video removed Successfully" });
  } catch (error) {
    res.status(500).json({ Error: `${error}` });
  }
});

router.delete("/:userId/history/delete/:videoId", async (req, res) => {
  try {
    const { userId, videoId } = req.params;
    const videoData = await History.findOneAndRemove({
      videoId,
    });
    if (!videoData) return res.status(404).send({ Message: "Video not Found" });
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { watchLater: videoData._id } },
      { new: true }
    );
    user.save();
    res.status(201).json({ Message: "Video removed Successfully" });
  } catch (error) {
    res.status(500).json({ Error: `${error}` });
  }
});
router.delete("/:userId/delete/likedVideos", async (req, res) => {
  try {
    const result = await LikedVideos.deleteMany({});
    const user = await User.findById(req.params.userId);
    user.history = [];
    await user.save();
    res
      .status(200)
      .json({ message: `Deleted ${result.deletedCount} documents` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:userId/delete/watchlater", async (req, res) => {
  try {
    const result = await WatchLater.deleteMany({});
    const user = await User.findById(req.params.userId);
    user.history = [];
    await user.save();
    res
      .status(200)
      .json({ message: `Deleted ${result.deletedCount} documents` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:userId/delete/history", async (req, res) => {
  try {
    const result = await History.deleteMany({});
    const user = await User.findById(req.params.userId);
    user.history = [];
    await user.save();
    res
      .status(200)
      .json({ message: `Deleted ${result.deletedCount} documents` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
