const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

//Routers
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const categoryRouter = require("./routes/catogories");

dotenv.config();
const app = express();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname + "/images")));
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File Has been uploaded");
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/category", categoryRouter);

const DB = process.env.MONGO_DATABASE.replace(
  "<password>",
  process.env.MONGO_PASSWORD
);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log(err);
  });

const Port = process.env.PORT;

app.listen(Port, (err) => {
  console.log("server has started");
});
