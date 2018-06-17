var Camp = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Camp.findById(req.params.id, function (err, foundCamp) {
            if (err || !foundCamp) {
                req.flash("danger", "Campground not found");
                res.redirect("back");
            } else {
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("danger", "You don't have permission to do that");
                    res.redirect("back");
                } // eof if/else id compare
            } // eof if/else of Camp.findById
        }) // eof Camp.findById
    } else {
        req.flash("warning", "You need to log first to do that");
        res.redirect("back");
    } // eof if/else of router.get
} // eof checkCampgroundOwnership 

middlewareObj.checkVisit = function(req,res,next){
        Camp.findById(req.params.id, function (err, foundCamp) {
            if (err || !foundCamp) {
                req.flash("danger", "Campground not found");
                res.redirect("back");
            } else {
                if(req.isAuthenticated()){
                    if (!foundCamp.author.id.equals(req.user._id)) {
                        ++foundCamp.visits;
                        foundCamp.save();
                        next();
                    }else{
                        next();
                    }
                }else{
                    ++foundCamp.visits;
                    foundCamp.save();
                    next();
                }
            }
        }) 
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash("danger", "Comment not found");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("danger", "You don't have permission to do that");
                    res.redirect("back");
                } // eof if/else id compare
            } // eof if/else of Camp.findById
        }) // eof Camp.findById
    } else {
        req.flash("warning", "You need to log first to do that");
        res.redirect("back");
    } // eof if/else of router.get
} // eof checkCampgroundOwnership

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("warning", "You need to be logged in to create a new camp");
    res.redirect('/login');
} // eof isLoggedIn

module.exports = middlewareObj;