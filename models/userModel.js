var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hash: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
