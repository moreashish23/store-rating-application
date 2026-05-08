const prisma = require("../config/prisma");
const { ratingSchema, updateRatingSchema } = require("../validators/schemas");

const getStores = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "10")));
  const skip = (page - 1) * limit;
  const { search, sortBy = "name", sortOrder = "asc" } = req.query;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }

  const validSortFields = ["name", "address", "createdAt"];
  const orderField = validSortFields.includes(sortBy) ? sortBy : "name";
  const order = sortOrder === "desc" ? "desc" : "asc";

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [orderField]: order },
      include: {
        ratings: { select: { value: true, userId: true } },
      },
    }),
    prisma.store.count({ where }),
  ]);

  const userId = req.user.id;

  const storesWithInfo = stores.map((store) => {
    const userRating = store.ratings.find((r) => r.userId === userId);
    const avg =
      store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length
        : null;
    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating: avg,
      totalRatings: store.ratings.length,
      userRating: userRating ? userRating.value : null,
    };
  });

  return res.json({
    success: true,
    data: storesWithInfo,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
};

const submitRating = async (req, res) => {
  const validated = ratingSchema.parse(req.body);
  const userId = req.user.id;

  const store = await prisma.store.findUnique({ where: { id: validated.storeId } });
  if (!store) {
    return res.status(404).json({ success: false, message: "Store not found." });
  }

  const existing = await prisma.rating.findUnique({
    where: { userId_storeId: { userId, storeId: validated.storeId } },
  });

  if (existing) {
    return res.status(409).json({ success: false, message: "You have already rated this store." });
  }

  const rating = await prisma.rating.create({
    data: { value: validated.value, userId, storeId: validated.storeId },
  });

  return res.status(201).json({ success: true, message: "Rating submitted.", data: rating });
};

const updateRating = async (req, res) => {
  const validated = updateRatingSchema.parse(req.body);
  const { storeId } = req.params;
  const userId = req.user.id;

  const rating = await prisma.rating.findUnique({
    where: { userId_storeId: { userId, storeId } },
  });

  if (!rating) {
    return res.status(404).json({ success: false, message: "Rating not found." });
  }

  const updated = await prisma.rating.update({
    where: { userId_storeId: { userId, storeId } },
    data: { value: validated.value },
  });

  return res.json({ success: true, message: "Rating updated.", data: updated });
};

module.exports = { getStores, submitRating, updateRating };