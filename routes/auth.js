const router = require("express").Router();
const User = require("../modals/User");
const bcrypt = require("bcrypt");

// Register
router.route("/register").post(async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hassedPass = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hassedPass,
    });

    const userDoc = await user.save();

    userDoc.password = undefined;
    res.status(200).json({ status: "success", user: userDoc });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.route("/login").post(async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json({ status: "wrong crediantials" });

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json({ status: "wrong crediantials" });

    user.password = undefined;
    res.status(200).json({ status: "success", user });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
