// LIBS
var flash                 = require("connect-flash");
var express               = require("express");
var request               = require("request");
var mongoose              = require("mongoose");
var passport              = require("passport");
var bodyParser            = require("body-parser");
var localStrategy         = require("passport-local");
var methodOverride        = require("method-override");
var expressSanitizer      = require("express-sanitizer");
var passportLocalMongoose = require("passport-local-mongoose");

// MODELS
var Camp                  = require("./models/campground");
var Comment               = require("./models/comment");
var User                  = require('./models/user');
var Ticket                = require('./models/ticket');
var seedDB                = require("./seeds");

// VIEWS
var indexRoutes           = require("./routes/index");
var commentRoutes         = require("./routes/comments");
var campgroundRoutes      = require("./routes/campgrounds");
var ticketRoutes      = require("./routes/tickets");
var dashboardRoutes      = require("./routes/dashboards");

// SET ENVIRONMENT
// LOCAL
if (!process.env.DATABASEURL){
  process.env.PORT = "3000";
  process.env.IP = "localhost";
  process.env.databaseURL = "mongodb://localhost/yelp_camp";
}

// SETUP
mongoose.connect('mongodb://localhost/yelp_camp');
// seedDB(); 
var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method')); // able to use ?_method=put on update form
app.use(expressSanitizer());
app.use(require("express-session")({
  secret: "Tommy is the mas pulentio",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // code session info
passport.deserializeUser(User.deserializeUser()); // decode session info

// USER CACHE ON ALL ROUTES
app.use(function(req, res, next){
  res.locals.currentUser  = req.user;
  res.locals.success      = req.flash("success");
  res.locals.info         = req.flash("info");
  res.locals.warning      = req.flash("warning");
  res.locals.danger       = req.flash("danger");
  next();
});

// VIEWS SETUP
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/tickets", ticketRoutes);
app.use("/campgrounds/:id/dashboards", dashboardRoutes);

// LISTEN - start
app.listen(process.env.PORT, process.env.IP, function (req, res) {  
  console.log("Server Started!");
});
// LISTEN - end
