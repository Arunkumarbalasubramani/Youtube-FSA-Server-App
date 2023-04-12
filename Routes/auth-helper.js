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
    const { email, password } = req.body;
    const userFromDB = await User.findOne({ email: email });

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
        const accessToken = jwt.sign(
          { id: userFromDB._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30m" }
        );
        const refreshToken = jwt.sign(
          { id: userFromDB._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        const saveTokeninDB = await User.findByIdAndUpdate(userFromDB._id, {
          refreshToken: { token: refreshToken },
        });
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        req.accessToken = accessToken;
        res
          .status(201)
          .json({ Message: "User LoggedIn Successfully", accessToken });
      }
    }
  } catch (error) {
    res.status(500).send({ Message: "Internal server Error" });
    console.log(error);
  }
};

exports.signIn = signIn;
