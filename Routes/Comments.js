const express = require("express");

const router = express.Router();

router.get("/videoId/comments", (req, res) => {
  res.send("it is working");
});
module.exports = router;
