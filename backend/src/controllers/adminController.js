const prisma = require("../config/prisma");
const { hashPassword } = require("../utils/password");
const { createUserSchema, createStoreSchema } = require("../validators/schemas");

const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || "10")));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const getDashboardStats = async (req, res) => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count({ where: { role: { not: "ADMIN" } } }),
    prisma.store.count(),
    prisma.rating.count(),
  ]);

  return res.json({
    success: true,
    data: { totalUsers, totalStores, totalRatings },
  });
};

const createUser = async (req, res) => {
  const validated = createUserSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: validated.email } });
  if (existing) {
    return res.status(409).json({ success: false, message: "Email already in use." });
  }

  const hashed = await hashPassword(validated.password);

  const user = await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      password: hashed,
      address: validated.address,
      role: validated.role || "USER",
    },
    select: { id: true, name: true, email: true, address: true, role: true },
  });

  return res.status(201).json({ success: true, message: "User created.", data: user });
};

const createStore = async (req, res) => {
  const validated = createStoreSchema.parse(req.body);

  const owner = await prisma.user.findUnique({ where: { id: validated.ownerId } });
  if (!owner) {
    return res.status(404).json({ success: false, message: "Owner not found." });
  }

  if (owner.role !== "STORE_OWNER") {
    return res.status(400).json({ success: false, message: "User must have STORE_OWNER role." });
  }

  const existingStore = await prisma.store.findUnique({ where: { ownerId: validated.ownerId } });
  if (existingStore) {
    return res.status(409).json({ success: false, message: "Owner already has a store." });
  }

  const store = await prisma.store.create({
    data: {
      name: validated.name,
      email: validated.email,
      address: validated.address,
      ownerId: validated.ownerId,
    },
  });

  return res.status(201).json({ success: true, message: "Store created.", data: store });
};

const getUsers = async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { search, sortBy = "name", sortOrder = "asc", role } = req.query;

  const where = {};

  if (role && ["ADMIN", "USER", "STORE_OWNER"].includes(role)) {
    where.role = role;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }

  const validSortFields = ["name", "email", "address", "role", "createdAt"];
  const orderField = validSortFields.includes(sortBy) ? sortBy : "name";
  const order = sortOrder === "desc" ? "desc" : "asc";

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [orderField]: order },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        store: { select: { id: true, name: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return res.json({
    success: true,
    data: users,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      store: {
        select: {
          id: true,
          name: true,
          ratings: { select: { value: true } },
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const storeRating =
    user.store && user.store.ratings.length > 0
      ? user.store.ratings.reduce((sum, r) => sum + r.value, 0) / user.store.ratings.length
      : null;

  return res.json({ success: true, data: { ...user, storeRating } });
};

const getStores = async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { search, sortBy = "name", sortOrder = "asc" } = req.query;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }

  const validSortFields = ["name", "email", "address", "createdAt"];
  const orderField = validSortFields.includes(sortBy) ? sortBy : "name";
  const order = sortOrder === "desc" ? "desc" : "asc";

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [orderField]: order },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        ratings: { select: { value: true } },
      },
    }),
    prisma.store.count({ where }),
  ]);

  const storesWithRating = stores.map((store) => ({
    ...store,
    averageRating:
      store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length
        : null,
    totalRatings: store.ratings.length,
  }));

  return res.json({
    success: true,
    data: storesWithRating,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
};

module.exports = {
  getDashboardStats,
  createUser,
  createStore,
  getUsers,
  getUserById,
  getStores,
};