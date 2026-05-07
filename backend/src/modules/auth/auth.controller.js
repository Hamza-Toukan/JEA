const { z } = require("zod");
const { loginWithEmailAndPassword } = require("./auth.service");

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required")
});

async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid login payload",
        details: z.flattenError(parsed.error).fieldErrors,
        requestId: req.requestId
      });
    }

    const result = await loginWithEmailAndPassword(parsed.data);

    return res.status(200).json({
      success: true,
      data: result,
      requestId: req.requestId
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login
};