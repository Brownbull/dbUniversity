var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ticketsSchema = new mongoose.Schema({
  price: Schema.Types.Decimal128,
  quantity: Number,
  time : { type : Date, default: Date.now },
  visitdate : { type : Date},
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    nickname: String
  },
  camping_id : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campground"
  },
});

module.exports = mongoose.model("Ticket", ticketsSchema);
