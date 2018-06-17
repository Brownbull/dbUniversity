var mongoose = require("mongoose");

var commentsSchema = mongoose.Schema({
  text: String,
  time : { type : Date, default: Date.now },
  camping_id : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campground"
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    nickname: String
  }
});

module.exports = mongoose.model("Comment", commentsSchema);
