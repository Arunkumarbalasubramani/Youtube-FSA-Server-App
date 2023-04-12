const express = require("express");
const cors = require("cors");
const { signUp, signIn } = require("./auth-helper");

const router = express.Router();

router.use(cors());
//Create User
router.post("/signup", signUp());

//Sign-IN
router.post("/signin", signIn);

// //Google Auth
// router.post("/signin");

module.exports = router;
