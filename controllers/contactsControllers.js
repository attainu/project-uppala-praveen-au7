const User = require("../models/userModel");

const ContactsControllers = {};

ContactsControllers.addContact = async function (req, res) {
  const loggedinUser = await User.findOne({ _id: req.id });
  const contacts = loggedinUser.contacts;
  const friendlyUser = await User.find({ email: req.body.email });
  contacts.push(friendlyUser._id);
  console.log(loggedinUser);
  console.log(friendlyUser);
  console.log(contacts);
  const addingFriendToLoggedInUser = await User.updateOne(
    { _id: req.id },
    {
      $set: {
        contacts: contacts,
      },
    }
  );
  return res.status(200).json(addingFriendToLoggedInUser);
};

ContactsControllers.deleteContact = async function (req, res) {
  const specificContact = await User.find({ _id: req.body._id });
  const loggedInUser = await User.findOne({ _id: req.id });
  const updatedContacts = loggedInUser.contacts.filter((contact) => {
    if (contact !== specificContact._id) {
      return contact;
    }
  });
  const loggedInUserWithUpdatedContacts = await User.updateOne(
    { _id: req.id },
    {
      $set: {
        contacts: updatedContacts,
      },
    }
  );
  res.json(loggedInUserWithUpdatedContacts);
};

module.exports = ContactsControllers;
