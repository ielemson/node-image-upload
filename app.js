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
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("img-upload");

//check file typ
function checkFileType(file, cb) {
  // allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  //check extens
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  //check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb("Error:Images only");
  }
}
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
      if (req.file == undefined) {
        res.render("index", {
          msg: "Error:No File Found"
        });
      } else {
        res.render("index", {
          msg: "File Uploaded",
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});
//create port number
const port = 3500;
app.listen(port, () => {
  console.log(`server started on port ${3500}`);
});
