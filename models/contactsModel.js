var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var contactsSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const Contacts = mongoose.model("Contacts", contactsSchema);

module.exports = Contacts;

//export const mongooseMatch = mongoose.model("contacts", contactsSchema);
