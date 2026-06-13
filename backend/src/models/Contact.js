const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxLength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxLength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      maxLength: [100, "Company name cannot exceed 100 characters"],
    },
    jobTitle: {
      type: String,
      trim: true,
      maxLength: [100, "Job title cannot exceed 100 characters"],
    },
    status: {
      type: String,
      enum: ["Lead", "Active", "Inactive"],
      default: "Lead",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      maxLength: [1000, "Notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Add compound index for faster queries tied to specific users
// e.g., finding contacts for a user by name or email
contactSchema.index({ user: 1, firstName: 1, lastName: 1 });
contactSchema.index({ user: 1, email: 1 });

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
