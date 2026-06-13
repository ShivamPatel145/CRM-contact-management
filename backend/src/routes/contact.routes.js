const express = require("express");
const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contact.controller");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth.middleware");
const {
  createContactSchema,
  updateContactSchema,
  queryContactSchema,
} = require("../validators/contact.validator");

const router = express.Router();

// All contact routes are protected
router.use(authenticate);

router
  .route("/")
  .get(validate(queryContactSchema, "query"), getContacts)
  .post(validate(createContactSchema), createContact);

router
  .route("/:id")
  .get(getContactById)
  .put(validate(updateContactSchema), updateContact)
  .delete(deleteContact);

module.exports = router;
