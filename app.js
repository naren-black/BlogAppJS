var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
mongoose.connect("mongodb://localhost/blog_app");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

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
  req.body.blog.body = req.sanitize(req.body.blog.body);
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

app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err,blogy) {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {blogy: blogy});
    }
  });
});

app.put("/blogs/:id", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

app.delete("/blogs/:id", function(req, res) {
  // Blog.findById(req.params.id, function(err, blogi) {
  //   if(err) {
  //     res.redirect("/blogs/" + req.params.id);
  //   }else {
  //     blogi.remove();
  //     res.redirect("/blogs");
  //   }
  // });
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect("/blogs/" + req.params.id);
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("The server has started...");
});