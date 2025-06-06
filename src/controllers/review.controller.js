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

  res.json(reviews);
};

exports.createReview = async (req, res) => {
  const { toUserId, text } = req.body;

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

  res.status(201).json(review);
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const review = await prisma.review.findUnique({ where: { id } });

  if (!review || review.fromUserId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const updated = await prisma.review.update({
    where: { id },
    data: { text }
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
  res.json({ message: 'Review deleted' });
};
