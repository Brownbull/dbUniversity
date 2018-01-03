// LIBS
var express               = require("express");
var app                   = express();
var request               = require("request");
var bodyParser            = require("body-parser");
var mongoose              = require("mongoose");
var seedDB                = require("./seeds");
var passport              = require("passport");
var bodyParser            = require("body-parser");
var localStrategy         = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

// MODELS
var Camp        = require("./models/campground");
var Comment     = require("./models/comment");
var User        = require('./models/user');

// SETUP
mongoose.connect("mongodb://localhost/yelp_camp2");
seedDB();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
  secret: "Tommy is the mas pulentio",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // code session info
passport.deserializeUser(User.deserializeUser()); // decode session info

//=============
// ROUTES
//=============
// INDEX
app.get("/", function(req, res){
  res.render("landing.ejs");
});

// INDEX
app.get("/campgrounds", function(req, res){
  // Get all campgrounds from DB
  Camp.find({}, function(err, camps){
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index.ejs", {campgrounds: camps});
    }
  });
  // res.render("campgrounds.ejs", {campgrounds: campgrounds});
});

// NEW
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new.ejs");
});

// SHOW
app.get("/campgrounds/:id", function(req, res){
  // find camp with id
  Camp.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {
      // console.log(foundCampground);
      res.render("campgrounds/show.ejs", {campground: foundCampground});
    } //eof if/else of Camp.findById
  }) // eof Camp.findById
}); // eof app.get

// CREATE
app.post("/campgrounds", function(req, res){
  // res.send("post req");
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name: name, image: image, description: description};
  // campgrounds.push(newCampground);
  // Crate new camp on DB
  Camp.create(newCampground, function(err, newcamp){
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// ===========================
// COMMENTS ROUTES
// ===========================
// New     /dogs/new          GET
app.get("/campgrounds/:id/comments/new", function(req, res){
  Camp.findById(req.params.id, function(err, campData){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new.ejs", {campground: campData});
    } // eof if/else of Camp.findById
  }) // eof Camp.findById
}); //eof app.get

// Create  /dogs     ->Rdrct  POST    Dog.create()
app.post("/campgrounds/:id/comments", function(req, res){
  Camp.findById(req.params.id, function(err, campData){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        } else {
          campData.comments.push(comment);
          campData.save();
          res.redirect('/campgrounds/' + campData._id)
        } // eof if/else of Comment.create
      }); // eof Comment.create
    } // eof if/else of Camp.findById
  }); // eof Camp.findById
}); //eof app.post

// LISTEN - start
app.listen(3000, 'localhost', function(req, res) {
  console.log("Server Started!");
});
// LISTEN - end
