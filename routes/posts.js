const router = require("express").Router();
const User = require("../modals/User");
const Post = require("../modals/Post");

// Create
router.route("/").post(async (req, res) => {
  const post = new Post(req.body);
  try {
    const savedPost = await post.save();
    res.status(200).json({ status: "success", post: savedPost });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update
router.route("/:id").put(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json({ status: "success", updatedPost });
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only update your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Deleted
router.route("/:id").delete(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res
          .status(200)
          .json({ status: "success", message: "Post has been deleted" });
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only delete your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get post
router.route("/:id").get(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json({ status: "success", post });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Posts
router.route("/").get(async (req, res) => {
  const username = req.query.username;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({ categories: { $in: [catName] } });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
