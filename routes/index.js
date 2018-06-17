var express   = require("express");
var router    = express.Router();
var passport  = require("passport");
var User      = require("../models/user");

//=============
// INDEX ROUTES
//=============
// INDEX
router.get("/", function(req, res){
  res.render("landing.ejs");
});

// ===========================
// AUTH ROUTES
// ===========================
// SHOW SIGN UP FORM
router.get("/register", function(req, res){
  res.render("register.ejs")
});

// HANDLING USER SIGN UP
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username, nickname: req.body.nickname})
  User.register(newUser, req.body.password, function(err, user){
    if (err) {
      req.flash("danger", err.message);
      res.render("register.ejs")
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to YeldCamp " + user.username);
      res.redirect("/campgrounds")
    }); // eof passport.authenticate
  }); // eof User.register
}); // eof app.post

// SHOW LOGIN FORM
router.get("/login", function(req, res){
  res.render("login.ejs");
});
// LOGIN LOGIC
router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  function(req, res){
});

// LOGOUT
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged Out Succesfully")
  res.redirect('/campgrounds');
});

// ===========================
// MIDDLEWARE
// ===========================
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

module.exports = router;
