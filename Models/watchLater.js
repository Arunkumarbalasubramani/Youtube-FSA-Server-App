const mongoose = require("mongoose");

const watchLater = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  videoId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  channelTitle: { type: String, required: true },
  channelId: { type: String, required: true },
  views: { type: String, required: true },
  likes: { type: String, required: true },
  uploadedAt: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("WatchLater", watchLater);
