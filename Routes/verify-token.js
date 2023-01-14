const express = require("express");
const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      res.status(401).send({ Message: "You are not authenticated" });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        res.status(403).send({ Message: "Token in Invalid" });
      } else {
        req.user = user;
        next();
      }
    });
  } catch (error) {
    response.status(401).send({ Error: error.message });
  }
};
module.exports = verifyToken;
