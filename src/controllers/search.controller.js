const prisma = require('../prisma/client');

exports.searchTenders = async (req, res) => {
  const { category, status, minPrice, maxPrice, from, to } = req.query;

  const tenders = await prisma.tender.findMany({
    where: {
      ...(category && { category }),
      ...(status && { status }),
      ...(minPrice && maxPrice && {
        price: { gte: parseFloat(minPrice), lte: parseFloat(maxPrice) }
      }),
      ...(from && to && {
        deadline: {
          gte: new Date(from),
          lte: new Date(to)
        }
      })
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(tenders);
};

exports.searchProposals = async (req, res) => {
  const { status, tenderId, userId } = req.query;

  const proposals = await prisma.proposal.findMany({
    where: {
      ...(status && { status }),
      ...(tenderId && { tenderId }),
      ...(userId && { userId })
    },
    include: { tender: true, user: true },
    orderBy: { createdAt: 'desc' }
  });

  res.json(proposals);
};
