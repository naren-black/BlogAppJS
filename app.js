var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_app");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req,res) {
  res.redirect("/blogs");
})

app.get("/blogs", function(req, res) {
  Blog.find({}, function(err,blogs) {
    if(err) {
      console.log(err);
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

app.get("/blogs/new", function(req, res) {
  res.render("new");
});

app.post("/blogs", function(req, res) {
  Blog.create(req.body.blog, function(err,newBlog) {
    if(err) {
      res.render("new");
    } else {
      res.redirect("/blogs")
    }
  });
});

app.get("/blogs/:id", function(req,res) {
  Blog.findById(req.params.id, function(err, blogg) {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {blogg: blogg});
    }
  })
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("The server has started...");
});