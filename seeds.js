var mongoose = require("mongoose");

// Models
var camp = require("./models/campground");
var comment = require("./models/comment");

// Base data
var data = [
  {
    name: "Salmon Creek",
    image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et q uasi architecto beatae vitae dicta sunt explicabo"
  },
  {
    name: "Loni Logic",
    image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
    description: "of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in"
  },
  {
    name: "In the Middle",
    image: "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg",
    description: "not foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice"
  }
];


// Seed functionality
function seedDB(){
  // remove all comments
  comment.remove({}, function(err) {
    if (err) {
      console.log(err);
    } else {
      // remove all campground
      camp.remove({}, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("ALL campgrounds removed.");
          // add campgorunds
          data.forEach(function(campground){
            camp.create(campground, function(err, campData){
              if (err) {
                console.log(err);
              } else {
                console.log("campground added");
                // create a comment
                comment.create(
                {
                  text: "This is a really nice place",
                  author: "Gabe"
                },
                function(err, comment){
                  if (err) {
                    console.log(err);
                  } else {
                    campData.comments.push(comment);
                    campData.save();
                    console.log("comments created");
                  } // eof if/else on comment.create
                }) // eof comment.create
              } // eof if/else on camp.create
            }) // eof camp.create
          }) // eof data.forEach
        } // eof if/else on camp.remove
      }) // eof camp.remove
    }; // eof function seedDB
  }) // eof comment.remove
}; //eof seedDB
module.exports = seedDB;
