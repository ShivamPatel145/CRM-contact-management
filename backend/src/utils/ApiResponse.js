/**
 * @file ApiResponse.js
 * @description Standardized success response helper.
 *
 * All successful API responses follow a consistent shape:
 * { success: true, message: "", data: {} }
 */

class ApiResponse {
  /**
   * @param {object} res        - Express response object
   * @param {number} statusCode - HTTP status code (default 200)
   * @param {string} message    - Human-readable success message
   * @param {*}      data       - Response payload
   */
  static send(res, statusCode = 200, message = "Success", data = null) {
    const payload = { success: true, message };

    if (data !== null) {
      payload.data = data;
    }

    return res.status(statusCode).json(payload);
  }
}

module.exports = ApiResponse;
