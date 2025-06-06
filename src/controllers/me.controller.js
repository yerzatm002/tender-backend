const prisma = require('../prisma/client');

exports.myTenders = async (req, res) => {
  if (req.user.role !== 'CUSTOMER') {
    return res.status(403).json({ error: 'Access denied: only CUSTOMER' });
  }

  const tenders = await prisma.tender.findMany({
    where: { ownerId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });

  res.json(tenders);
};

exports.myProposals = async (req, res) => {
  if (req.user.role !== 'SUPPLIER') {
    return res.status(403).json({ error: 'Access denied: only SUPPLIER' });
  }

  const proposals = await prisma.proposal.findMany({
    where: { userId: req.user.id },
    include: { tender: true },
    orderBy: { createdAt: 'desc' }
  });

  res.json(proposals);
};

exports.myDocuments = async (req, res) => {
  const documents = await prisma.document.findMany({
    where: { userId: req.user.id },
    orderBy: { uploadedAt: 'desc' }
  });

  res.json(documents);
};
