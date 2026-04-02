const mongoose = require('mongoose');

const converstionSchema = new mongoose.Schema({

  groupTitle : {
    type : String
  },
  members : {
    type : Array,
  },
  lastMessage : {
    type : String
  },
  LastMessageId : {
    type  :String
  },
},{timestamps : true});

module.exports = mongoose.model('Conversation',converstionSchema);