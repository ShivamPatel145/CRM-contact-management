const Contact = require("../models/Contact");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all contacts for authenticated user
// @route   GET /api/contacts
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search, company, sortBy = "createdAt", order = "desc" } = req.query;

  // Build query object
  const query = { user: req.user._id };

  if (status) {
    query.status = status;
  }

  if (company) {
    query.company = new RegExp(company, "i");
  }

  if (search) {
    const terms = search.trim().split(/\s+/).filter(Boolean);
    if (terms.length > 0) {
      query.$and = terms.map((term) => {
        const termRegex = new RegExp(term, "i");
        return {
          $or: [
            { firstName: termRegex },
            { lastName: termRegex },
            { email: termRegex },
            { company: termRegex },
          ],
        };
      });
    }
  }

  // Calculate pagination
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  // Translate sortBy to actual model fields
  let sortOption = {};
  const sortOrder = order === "asc" ? 1 : -1;

  if (sortBy === "newest") {
    sortOption = { createdAt: -1 };
  } else if (sortBy === "oldest") {
    sortOption = { createdAt: 1 };
  } else if (sortBy === "name") {
    sortOption = { firstName: sortOrder, lastName: sortOrder };
  } else {
    sortOption = { [sortBy]: sortOrder };
  }

  // Execute query
  const contacts = await Contact.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber);

  // Get total count for pagination metadata
  const total = await Contact.countDocuments(query);

  res.status(200).json({
    success: true,
    data: contacts,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      limit: limitNumber,
    },
  });
});

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  res.status(200).json({
    success: true,
    data: contact,
  });
});

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Private
const createContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Build duplicate query
  const duplicateQuery = {
    user: req.user._id,
    $or: [
      { firstName: String(firstName || "").trim(), lastName: String(lastName || "").trim() }
    ]
  };

  if (email && String(email).trim()) {
    duplicateQuery.$or.push({ email: String(email).trim().toLowerCase() });
  }

  const existingContact = await Contact.findOne(duplicateQuery);
  if (existingContact) {
    res.status(400);
    throw new Error("A contact with this name or email already exists in your network.");
  }

  // Add user to request body
  const contactData = { ...req.body, user: req.user._id };

  const contact = await Contact.create(contactData);

  res.status(201).json({
    success: true,
    data: contact,
  });
});

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;

  let contact = await Contact.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  // Build duplicate query excluding current contact
  const duplicateQuery = {
    user: req.user._id,
    _id: { $ne: req.params.id },
    $or: [
      { firstName: String(firstName || contact.firstName).trim(), lastName: String(lastName || contact.lastName).trim() }
    ]
  };

  const checkEmail = email !== undefined ? email : contact.email;
  if (checkEmail && String(checkEmail).trim()) {
    duplicateQuery.$or.push({ email: String(checkEmail).trim().toLowerCase() });
  }

  const existingContact = await Contact.findOne(duplicateQuery);
  if (existingContact) {
    res.status(400);
    throw new Error("A contact with this name or email already exists in your network.");
  }

  contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: contact,
  });
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: "Contact removed",
  });
});

// @desc    Import multiple contacts
// @route   POST /api/contacts/import
// @access  Private
const importContacts = asyncHandler(async (req, res) => {
  const { contacts } = req.body;

  if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
    res.status(400);
    throw new Error("Invalid or empty contacts list");
  }

  // Retrieve existing contacts of the user to check for duplicates
  const existingContacts = await Contact.find({ user: req.user._id });
  const existingEmails = new Set(existingContacts.map(c => c.email).filter(Boolean));
  const existingNames = new Set(existingContacts.map(c => `${c.firstName.trim().toLowerCase()}_${c.lastName.trim().toLowerCase()}`));

  const seenEmails = new Set();
  const seenNames = new Set();

  const contactsToInsert = [];

  for (const c of contacts) {
    if (!c.firstName || !String(c.firstName).trim()) continue;

    const fName = String(c.firstName).trim();
    const lName = String(c.lastName || "").trim();
    const emailLower = c.email && String(c.email).trim() ? String(c.email).trim().toLowerCase() : undefined;
    const nameKey = `${fName.toLowerCase()}_${lName.toLowerCase()}`;

    // Skip if email matches an existing contact or another contact in the import list
    if (emailLower && (existingEmails.has(emailLower) || seenEmails.has(emailLower))) {
      continue;
    }

    // Skip if first + last name matches an existing contact or another contact in the import list
    if (existingNames.has(nameKey) || seenNames.has(nameKey)) {
      continue;
    }

    if (emailLower) seenEmails.add(emailLower);
    seenNames.add(nameKey);

    contactsToInsert.push({
      user: req.user._id,
      firstName: fName,
      lastName: lName,
      email: emailLower,
      phone: String(c.phone || "").trim(),
      company: String(c.company || "").trim(),
      jobTitle: String(c.jobTitle || "").trim(),
      status: ["Lead", "Active", "Inactive"].includes(c.status) ? c.status : "Lead",
      notes: String(c.notes || "").trim(),
    });
  }

  if (contactsToInsert.length === 0) {
    res.status(400);
    throw new Error("No new or unique contacts found to import (all records are either duplicates or invalid).");
  }

  // Bulk insert
  const imported = await Contact.insertMany(contactsToInsert);

  res.status(201).json({
    success: true,
    message: `${imported.length} contacts imported successfully`,
    data: imported,
  });
});

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  importContacts,
};
