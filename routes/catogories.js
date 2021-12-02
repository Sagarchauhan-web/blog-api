const router = require("express").Router();
const Category = require("../modals/catogory");

router.route("/").post(async (req, res) => {
  const cat = new Category(req.body);
  try {
    const savedCat = await cat.save();
    res.status(200).json(savedCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.route("/").get(async (req, res) => {
  try {
    const cat = await Category.find();
    res.status(200).json(cat);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
