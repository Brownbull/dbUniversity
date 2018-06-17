var express = require("express");
var router  = express.Router();
var Camp = require("../models/campground");
var Comment = require("../models/comment");
var Ticket = require("../models/ticket");
var middleware = require("../middleware"); // same as middleware/index.js




// SHOW
router.get("/:id",function(req, res){
  // find camp with id
    totalAmout = 0;

           

  Camp.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {

      Ticket.aggregate([
        { 
          $match: {
            camping_id: foundCampground._id
          }
        }, {
          $group: {
            _id: null,
            totalTickets: {
              $sum: "$quantity" 
            },
            amountTickets:{
                $sum: {
                    $multiply: [
                      '$quantity',
                      parseFloat(foundCampground.price)
                      
                    ]
                  }
            }
          }
        }
      ],function(err,TicketsSell){
        Ticket.find({ camping_id: foundCampground._id },function(err,tick){
            if(err){
                console.log(err)
            }else{
                totalAmount = tick.reduce(function(quantity) { return quantity; }, 0)
                res.render("dashboards/show.ejs", {campground: foundCampground, tickeds:tick, numberofTickets: TicketsSell[0]});
            }
          });
      });


      
      
    } //eof if/else of Camp.findById
  }) // eof Camp.findById
}); // eof router.get


module.exports = router;
