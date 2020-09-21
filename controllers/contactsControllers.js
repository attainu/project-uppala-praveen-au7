const User = require("../models/userModel");

const ContactsControllers = {};

ContactsControllers.viewSpecificContact = async function (req, res) {
  try {
    const specificFriend = await User.findOne({ _id: req.body._id });
    res.json(specificFriend);
  } catch (err) {
    res.json({ message: err.message });
  }
};

ContactsControllers.viewContacts = async function (req, res) {
  try {
    User.findOne({ _id: req.id })
      .then(async (user) => {
        let friends = user.contacts;
        let size = user.contacts.length;
        let contacts = [];
        for (let i = 0; i < size; i++) {
          const contact = await User.findOne({ _id: friends[i] });
          contacts.push(contact);
        }
        return contacts;
      })
      .then((contacts) => res.json(contacts));
  } catch (err) {
    res.json({ message: err.message });
  }
};

ContactsControllers.addContact = async function (req, res) {
  const loggedinUser = await User.findOne({ _id: req.id });
  const contacts = loggedinUser.contacts;
  const friendlyUser = await User.findOne({ email: req.body.email });
  contacts.push(friendlyUser._id);
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
  const specificContact = await User.findOne({ _id: req.body._id });
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
