const express = require("express");
const multer = require("multer");
//embedded javascript ... our template engine
const ejs = require("ejs");

const path = require("path");

//set storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(re, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

//init upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 }
}).single("img-upload");
//init our variables
const app = express();

//set the view
app.set("view engine", "ejs");

//set static public folder
app.use(express.static("./public"));
//index route
app.get("/", (req, res) => res.render("index"));

//set up post route
app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("index", { msg: err });
    } else {
      console.log(req.file);
      res.send("test");
    }
  });
});
//create port number
const port = 3500;
app.listen(port, () => {
  console.log(`server started on port ${3500}`);
});
