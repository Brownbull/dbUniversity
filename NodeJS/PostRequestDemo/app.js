var express = require("express");
var app = express();

// Setup public directory
app.use(express.static("public"));

// GET - start
// "/" Hi there
app.get("/", function(req, res){
  res.render("home.ejs");
  // console.log("dog request made");
  // res.send("Hi there!");
});

// default - this must go at the end of all other routes
app.get("*", function(req, res){
  console.log("non routed route reached!");
  res.send("non routed route reached");
});
// GET - end

// LISTEN - start
// Tell Express to listen for request (Start server)
// c9
// app.listen(process.env.PORT, process.env.IP, function(){
// local
app.listen(3000, 'localhost', function(req, res) {
  console.log("Server Started!");
});
// LISTEN - end
