const User = require("../Models/User");
const bcrypt = require("bcrypt");
const generateHashedPassword = require("./encryption");
const jwt = require("jsonwebtoken");

function signUp() {
  return async (req, res) => {
    try {
      const hashedPassword = await generateHashedPassword(req.body.password);
      const data = { ...req.body, password: hashedPassword };
      const user = new User(data);
      {
        user.save((err, data) => {
          if (err) {
            if (err.code === 11000) {
              res.status(404).send({ Message: "User Already Exists" });
            } else {
              res
                .status(400)
                .send({ Message: "Error While Creating User", err });
            }
          } else {
            res
              .status(201)
              .send({ id: data._id, Message: "User Added Successfully" });
          }
        });
      }
    } catch (error) {
      res.status(500).send({ Message: "Internal Server Error" });
      console.log(error);
    }
  };
}

exports.signUp = signUp;

const signIn = async (req, res) => {
  try {
    const { name, password } = req.body;
    const userFromDB = await User.findOne({ name: name });

    if (!userFromDB) {
      res.status(404).send({ Message: "User Not Found" });
    } else {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        userFromDB.password
      );
      if (!isPasswordCorrect) {
        res.status(400).send({ Message: "Wrong Credentials" });
      } else {
        const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
        const { password, ...others } = userFromDB._doc;
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(others);
        // res.status(200).send({ Message: "User LoggedIn Successfully" });
      }
    }
  } catch (error) {
    res.status(500).send({ Message: "Internal server Error" });
    console.log(error);
  }
};

exports.signIn = signIn;
