var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var campgroundSchema = new mongoose.Schema({
  name: String,
  price: Schema.Types.Decimal128,
  image: String,
  description: String,
  visits : {type: Number, default : 0 },
  time : { type : Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    nickname: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
}, { usePushEach: true });

module.exports = mongoose.model("Campground", campgroundSchema);
