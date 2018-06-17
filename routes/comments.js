var express = require("express");
var router  = express.Router({mergeParams: true});
var Camp = require("../models/campground");
var Comment = require("../models/comment");
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
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          req.flash("danger", err);
          console.log(err);
        } else {
          // add username and id to comment
          comment.camping_id = campData._id;
          comment.author.id = req.user._id;
          comment.author.nickname = req.user.nickname;
          // save comment
          comment.save();
          campData.comments.push(comment);
          campData.save();
          req.flash("success", "Comment added");
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

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  // sanitize input to delete script or malicius code
  // req.body.campground.description = req.sanitize(req.body.campground.description);
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      req.flash("danger", err);
      res.redirect("back");
    } else {
      req.flash("success", "Comment edited");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      req.flash("danger", err);
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

module.exports = router;
