const { z } = require("zod");

// Base schema for reusability
const contactBaseSchema = {
  firstName: z
    .string({
      required_error: "First name is required",
    })
    .min(1, "First name cannot be empty")
    .max(50, "First name cannot exceed 50 characters")
    .trim(),

  lastName: z
    .string({
      required_error: "Last name is required",
    })
    .min(1, "Last name cannot be empty")
    .max(50, "Last name cannot exceed 50 characters")
    .trim(),

  email: z
    .string()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal("")),

  phone: z.string().trim().optional(),

  company: z
    .string()
    .max(100, "Company name cannot exceed 100 characters")
    .optional(),

  jobTitle: z
    .string()
    .max(100, "Job title cannot exceed 100 characters")
    .optional(),

  status: z.enum(["Lead", "Active", "Inactive"]).optional(),

  tags: z.array(z.string().trim()).optional(),

  notes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional(),
};

const createContactSchema = z.object(contactBaseSchema);

// For updates, all fields become optional
const updateContactSchema = z.object(contactBaseSchema).partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided to update",
  }
);

// Schema for validating list queries
const queryContactSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: z.enum(["Lead", "Active", "Inactive"]).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

module.exports = {
  createContactSchema,
  updateContactSchema,
  queryContactSchema,
};
