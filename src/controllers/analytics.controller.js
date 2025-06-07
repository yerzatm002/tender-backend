const prisma = require('../prisma/client');

exports.getOverview = async (req, res) => {
  const totalTenders = await prisma.tender.count();
  const totalProposals = await prisma.proposal.count();
  const totalUsers = await prisma.user.count();
  const averagePrice = await prisma.tender.aggregate({
    _avg: { price: true }
  });

  res.json({
    totalTenders,
    totalProposals,
    totalUsers,
    averageTenderPrice: averagePrice._avg.price
  });
};

exports.getTopSuppliers = async (req, res) => {
  const top = await prisma.proposal.groupBy({
    by: ['userId'],
    where: { status: 'APPROVED' },
    _count: { userId: true },
    orderBy: { _count: { userId: 'desc' } },
    take: 5,
  });

  const enriched = await Promise.all(
    top.map(async (entry) => {
      const user = await prisma.user.findUnique({ where: { id: entry.userId } });
      return {
        supplier: { id: user.id, name: user.name, email: user.email },
        wins: entry._count.userId,
      };
    })
  );

  res.json(enriched);
};


exports.getTenderStats = async (req, res) => {
  const { id } = req.params;

  const totalProposals = await prisma.proposal.count({ where: { tenderId: id } });
  const avgProposalPrice = await prisma.proposal.aggregate({
    where: { tenderId: id },
    _avg: { tender: { select: { price: true } } } // Optional: tender-based pricing
  });

  const approved = await prisma.proposal.count({
    where: { tenderId: id, status: 'APPROVED' }
  });

  res.json({
    totalProposals,
    approved,
    averageTenderPrice: avgProposalPrice._avg?.tender?.price || null
  });
};
