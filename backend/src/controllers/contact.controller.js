const Contact = require("../models/Contact");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all contacts for authenticated user
// @route   GET /api/contacts
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search, sortBy = "createdAt", order = "desc" } = req.query;

  // Build query object
  const query = { user: req.user.userId };

  if (status) {
    query.status = status;
  }

  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { company: searchRegex },
    ];
  }

  // Calculate pagination
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  // Execute query
  const contacts = await Contact.find(query)
    .sort({ [sortBy]: order === "asc" ? 1 : -1 })
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
    user: req.user.userId,
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
  // Add user to request body
  const contactData = { ...req.body, user: req.user.userId };

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
  let contact = await Contact.findOne({
    _id: req.params.id,
    user: req.user.userId,
  });

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
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
    user: req.user.userId,
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

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
