/**
 * @file validate.js
 * @description Generic Zod request validation middleware factory.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), authController.register)
 *
 * The schema should have shape: z.object({ body?, params?, query? })
 * On failure, passes a ZodError to the global error handler which
 * formats it into a clean 400 response.
 */

const { ZodError } = require("zod");
const ApiError = require("../utils/ApiError");

/**
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {import('express').RequestHandler}
 */
const validate = (schema) => (req, res, next) => {
  try {
    // Parse only the parts the schema defines
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    // Attach sanitized/coerced values back to req
    if (parsed.body) req.body = parsed.body;
    if (parsed.params) req.params = parsed.params;
    if (parsed.query) req.query = parsed.query;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map((e) => ({
        field: e.path.filter((p) => p !== "body" && p !== "params" && p !== "query").join("."),
        message: e.message,
      }));
      return next(new ApiError(400, "Validation failed", errors));
    }
    next(error);
  }
};

module.exports = validate;
