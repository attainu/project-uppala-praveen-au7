const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const User = db.User;

async function authenticate({ email, password }) {
  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign({ sub: user._id }, config.secret, {
      expiresIn: "7d",
    });
    return {
      ...user.toJSON(),
      token,
    };
  }
}

async function tokenVerify(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const id = jwt.verify(token, config.secret);
  req.id = id.sub;
  next();
}

async function getAll(req, res) {
  //return await User.findOne();
  return await User.find({ _id: req.id });
}

async function create(userParam) {
  // validate
  if (await User.findOne({ email: userParam.email })) {
    throw "Username " + userParam.email + " is already taken";
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await user.save();
}

module.exports = {
  authenticate,
  getAll,
  create,
  tokenVerify,
};
