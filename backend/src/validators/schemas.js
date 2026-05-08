const { z } = require("zod");

const nameSchema = z
  .string()
  .min(20, "Name must be at least 20 characters")
  .max(60, "Name must be at most 60 characters");

const addressSchema = z
  .string()
  .max(400, "Address must be at most 400 characters");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    "Password must contain at least one special character"
  );

const emailSchema = z.string().email("Invalid email address");

const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: z.enum(["ADMIN", "USER", "STORE_OWNER"]).optional(),
});

const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerId: z.string().uuid("Invalid owner ID"),
});

const ratingSchema = z.object({
  storeId: z.string().uuid("Invalid store ID"),
  value: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});

const updateRatingSchema = z.object({
  value: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  createUserSchema,
  createStoreSchema,
  ratingSchema,
  updateRatingSchema,
};