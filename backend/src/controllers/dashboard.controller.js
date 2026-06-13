const asyncHandler = require("../utils/asyncHandler");
const Contact = require("../models/Contact");

/**
 * @desc    Get dashboard statistics for the logged-in user
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Run all count queries in parallel for performance
  const [totalContacts, activeClients, leads, inactive] = await Promise.all([
    Contact.countDocuments({ user: userId }),
    Contact.countDocuments({ user: userId, status: "Active" }),
    Contact.countDocuments({ user: userId, status: "Lead" }),
    Contact.countDocuments({ user: userId, status: "Inactive" })
  ]);

  // Fetch the 20 most recently added contacts
  const recentContacts = await Contact.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .select("firstName lastName email company status createdAt")
    .lean();

  res.json({
    success: true,
    data: {
      metrics: {
        totalContacts,
        activeClients,
        leads,
        inactive
      },
      recentContacts,
    },
  });
});

module.exports = {
  getDashboardStats,
};
