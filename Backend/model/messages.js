const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId : {
    type : String,
    required : true
  },
  text : {
    type  :String
  },
  sender : {
    type : String,
  },
  images : [
    {
      type : String
    }
  ],
},{timeStamps : true});


module.exports = mongoose.model('Message',messageSchema);