var express = require("express");
var router  = express.Router();
var Camp = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // same as middleware/index.js


//=============
// CAMPGROUND ROUTES
//=============
// INDEX
router.get("/", function(req, res){
  Camp.find({}, function(err, camps){
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index.ejs", {campgrounds: camps});
    } // oef if/else of Camp.find
  }); //eof Camp.find
}); // eof apt.get

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new.ejs");
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
  // res.send("post req");
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    nickname: req.user.nickname
  }
  var newCampground = {name: name, image: image, description: description, author: author};
  // Crate new camp on DB
  Camp.create(newCampground, function(err, newcamp){
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// SHOW
router.get("/:id", middleware.checkVisit,function(req, res){
  // find camp with id
  Camp.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {
      // console.log(foundCampground);
      res.render("campgrounds/show.ejs", {campground: foundCampground});
    } //eof if/else of Camp.findById
  }) // eof Camp.findById
}); // eof router.get

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
  Camp.findById(req.params.id, function(err, foundCamp){
    res.render("campgrounds/edit.ejs", {campground: foundCamp});
  }); // eof Camp.findById
}); // eof router.get

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  // sanitize input to delete script or malicius code
  // req.body.campground.description = req.sanitize(req.body.campground.description);
  Camp.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Camp.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.find({ camping_id: req.params.id }).remove().exec();
      res.redirect("/campgrounds");
    }
  })
});

module.exports = router;
