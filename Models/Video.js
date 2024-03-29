const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  channelTitle: { type: String, required: true },
  channelId: { type: String, required: true },
  views: { type: String, required: true },
  likes: { type: String, required: true },
  uploadedAt: { type: String, required: true },
  description: { type: String, required: true },
  videoType: { type: String, required: true },
});

module.exports = mongoose.model("Video", VideoSchema);
