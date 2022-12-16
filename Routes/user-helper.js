const User = require("../Models/User");

const updateUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(201).send(updatedUser);
    } else {
      res.status(403).send({ Message: "You can Update Your account only" });
    }
  } catch (error) {
    res.status(500).send({ Message: "Internal serverError" });
  }
};
exports.updateUser = updateUser;

const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      res.status(201).send({ Message: "User Has Been deleted Successfully" });
    } else {
      res.status(403).send({ Message: "You can delete Your account only" });
    }
  } catch (error) {
    res.status(500).send({ Message: "Internal serverError" });
  }
};

exports.deleteUser = deleteUser;

const getUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      const getUser = await User.findById(req.params.id);
      res.status(201).send(getUser);
    } else {
      res.status(403).send({ Message: "You can View Your account only" });
    }
  } catch (error) {
    res.status(500).send({ Message: "Internal serverError" });
  }
};

exports.getUser = getUser;
