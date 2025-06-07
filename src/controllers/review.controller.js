const prisma = require('../prisma/client');

exports.getReviewsByUser = async (req, res) => {
  const { userId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { toUserId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      fromUser: { select: { id: true, name: true } }
    }
  });

  const average = await prisma.rating.aggregate({
    where: { userId },
    _avg: { score: true }
  });

  res.json({
    reviews,
    averageScore: average._avg.score || 0
  });
};

exports.createReview = async (req, res) => {
  const { toUserId, text, score } = req.body;

  if (!toUserId || !score || !text) {
    return res.status(400).json({ error: "Missing review fields" });
  }

  if (toUserId === req.user.id) {
    return res.status(400).json({ error: "Can't review yourself" });
  }

  const review = await prisma.review.create({
    data: {
      fromUserId: req.user.id,
      toUserId,
      text
    }
  });

  await prisma.rating.create({
    data: {
      score,
      userId: toUserId,
      raterId: req.user.id
    }
  });

  res.status(201).json(review);
};


exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { text, score } = req.body;

  const review = await prisma.review.findUnique({ where: { id } });

  if (!review || review.fromUserId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const updated = await prisma.review.update({
    where: { id },
    data: { text }
  });

  await prisma.rating.updateMany({
    where: {
      raterId: req.user.id,
      userId: review.toUserId
    },
    data: { score }
  });

  res.json({ message: 'Review updated', review: updated });
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  const review = await prisma.review.findUnique({ where: { id } });

  if (!review || review.fromUserId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  await prisma.review.delete({ where: { id } });

  await prisma.rating.deleteMany({
    where: {
      raterId: req.user.id,
      userId: review.toUserId
    }
  });

  res.json({ message: 'Review and rating deleted' });
};
