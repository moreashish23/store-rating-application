const prisma = require("../config/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require("../validators/schemas");

const register = async (req, res) => {
  const validated = registerSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (existingUser) {
    return res.status(409).json({ success: false, message: "Email already in use." });
  }

  const hashed = await hashPassword(validated.password);

  const user = await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      password: hashed,
      address: validated.address,
      role: "USER",
    },
    select: { id: true, name: true, email: true, address: true, role: true },
  });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return res.status(201).json({
    success: true,
    message: "Registration successful.",
    data: { user, token },
  });
};

const login = async (req, res) => {
  const validated = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials." });
  }

  const isMatch = await comparePassword(validated.password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid credentials." });
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return res.json({
    success: true,
    message: "Login successful.",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
      token,
    },
  });
};

const changePassword = async (req, res) => {
  const validated = changePasswordSchema.parse(req.body);
  const userId = req.user.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const isMatch = await comparePassword(validated.currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: "Current password is incorrect." });
  }

  const hashed = await hashPassword(validated.newPassword);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

  return res.json({ success: true, message: "Password changed successfully." });
};

const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, address: true, role: true },
  });

  return res.json({ success: true, data: user });
};

module.exports = { register, login, changePassword, getMe };