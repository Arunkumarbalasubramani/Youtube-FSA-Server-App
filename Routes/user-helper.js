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
    const getUser = await User.findById(req.params.id);
    const { password, ...others } = getUser._doc;
    if (getUser) {
      res.status(201).send(others);
    } else {
      res.status(404).send({ Message: "User not Found" });
    }
  } catch (error) {
    res.status(500).send({ Message: "Internal serverError" });
  }
};

exports.getUser = getUser;

const subscribe = async (req, res) => {
  try {
    await User.findById(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: 1 } });
    res.status(201).send({ Message: "Subscription Addded" });
  } catch (error) {
    res.status(500).send({ Message: "Internal serverError" });
  }
};

exports.subscribe = subscribe;

const unSubscribe = async (req, res) => {
  try {
    await User.findById(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: -1 } });
    res.status(201).send({ Message: "Subscription removed" });
  } catch (error) {
    res.status(500).send({ Message: "Internal serverError" });
  }
};

exports.unSubscribe = unSubscribe;
