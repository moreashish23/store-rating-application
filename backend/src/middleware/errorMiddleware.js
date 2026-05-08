const { ZodError } = require("zod");
const { Prisma } = require("@prisma/client");

const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const field = Array.isArray(err.meta?.target)
        ? err.meta.target.join(", ")
        : "field";
      return res.status(409).json({
        success: false,
        message: `A record with this ${field} already exists.`,
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found.",
      });
    }
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;