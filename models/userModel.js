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
  contacts: {
    type: Array,
  },
});

/*userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});*/

const User = mongoose.model("User", userSchema);

module.exports = User;
