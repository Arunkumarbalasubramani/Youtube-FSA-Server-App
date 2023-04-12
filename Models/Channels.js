const mongoose = require("mongoose");

const subscribedChannesls = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  channelId: {
    type: String,
    required: true,
  },
  channelAvatar: {
    type: String,
  },
  channelInfo: {
    subscribers: { type: String },
  },
});

module.exports = mongoose.model("SubscribedChannels", subscribedChannesls);
