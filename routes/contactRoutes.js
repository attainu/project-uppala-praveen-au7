const express = require("express");
const router = express.Router();
const contacts = require("../controllers/contactsControllers");
const { tokenVerify } = require("../controllers/userControllers");

router.post("/addContact", tokenVerify, contacts.addContact);
router.delete("/deleteContact", tokenVerify, contacts.deleteContact);
router.get("/viewSpecificContact", tokenVerify, contacts.viewSpecificContact);
router.get("/viewContacts", tokenVerify, contacts.viewContacts);

module.exports = router;
