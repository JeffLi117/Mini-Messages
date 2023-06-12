const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user_name: { type: String, required: true, maxLength: 20 },
  message_text: { type: String, required: true, maxLength: 150 },
  time_added: { type: Date }, 
}, { collection : 'messages'});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
