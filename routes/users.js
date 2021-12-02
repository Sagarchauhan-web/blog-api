const router = require("express").Router();
const User = require("../modals/User");
const Post = require("../modals/Post");
const bcrypt = require("bcrypt");

// Updated
router.route("/:id").put(async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const userDoc = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json({ status: "success", user: userDoc });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can only update your account");
  }
});

// Deleted
router.route("/:id").delete(async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);

        res
          .status(200)
          .json({ status: "success", message: "User has been deleted" });
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("user not found");
    }
  } else {
    res.status(401).json("You can only delete your account");
  }
});

// Get A user
router.route("/:id").get(async (req, res) => {
  try {
    const userDoc = await User.findById(req.params.id);
    userDoc.password = undefined;
    res.status(200).json({ status: "success", user: userDoc });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
