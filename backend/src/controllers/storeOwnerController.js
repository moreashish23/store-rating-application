const prisma = require("../config/prisma");

const getStoreDashboard = async (req, res) => {
  const userId = req.user.id;

  const store = await prisma.store.findUnique({
    where: { ownerId: userId },
    include: {
      ratings: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!store) {
    return res.status(404).json({ success: false, message: "Store not found." });
  }

  const averageRating =
    store.ratings.length > 0
      ? store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length
      : null;

  const raters = store.ratings.map((r) => ({
    userId: r.user.id,
    name: r.user.name,
    email: r.user.email,
    rating: r.value,
    ratedAt: r.createdAt,
  }));

  return res.json({
    success: true,
    data: {
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      averageRating,
      totalRatings: store.ratings.length,
      raters,
    },
  });
};

module.exports = { getStoreDashboard };