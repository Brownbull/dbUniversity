var express = require("express");
var router  = express.Router({mergeParams: true});
var Camp = require("../models/campground");
var Ticket = require("../models/ticket");
var middleware = require("../middleware"); // same as middleware/index.js

// ===========================
// COMMENTS ROUTES
// ===========================
// New     /dogs/new          GET
router.get("/new", middleware.isLoggedIn, function(req, res){
  Camp.findById(req.params.id, function(err, campData){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new.ejs", {campground: campData});
    } // eof if/else of Camp.findById
  }) // eof Camp.findById
}); //eof app.get

// Create  /dogs     ->Rdrct  POST    Dog.create()
router.post("/", middleware.isLoggedIn, function(req, res){
  Camp.findById(req.params.id, function(err, campData){
    if (err) {
      req.flash("danger", err);
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Ticket.create(req.body.ticket, function(err, tick){
        if (err) {
          req.flash("danger", err);
          console.log(err);
        } else {
          // add username and id to comment
          tick.camping_id = campData._id;
          tick.author.id = req.user._id;
          tick.author.nickname = req.user.nickname;
          // save comment
          tick.save();
          req.flash("success", "Ticked buyed");
          res.redirect('/campgrounds/' + campData._id)
        } // eof if/else of Comment.create
      }); // eof Comment.create
    } // eof if/else of Camp.findById
  }); // eof Camp.findById
}); //eof app.post

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Camp.findById(req.params.id, function(err, foundCamp){
    if (err || !foundCamp) {
      req.flash("danger", "Campgroung not found");
      return res.redirect("back");
    }
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        req.flash("danger", err);
        res.redirect("back");
      } else {
        res.render("comments/edit.ejs", { campground_id: req.params.id, comment: foundComment });
      }
    }); // eof Comment.findById
  }); // eof Camp.findById
}); // eof router.get


module.exports = router;
