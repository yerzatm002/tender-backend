const prisma = require('../prisma/client');

exports.getAllProposals = async (req, res) => {
  const { status, tenderId } = req.query;

  const proposals = await prisma.proposal.findMany({
    where: {
      ...(status && { status }),
      ...(tenderId && { tenderId })
    },
    include: {
      tender: true,
      user: { select: { id: true, name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(proposals);
};

exports.getProposalById = async (req, res) => {
  const { id } = req.params;
  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      tender: true,
      user: { select: { id: true, name: true, email: true } }
    }
  });
  if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
  res.json(proposal);
};

exports.createProposal = async (req, res) => {
  const { message, tenderId } = req.body;

  const proposal = await prisma.proposal.create({
    data: {
      message,
      tenderId,
      userId: req.user.id
    }
  });

  res.status(201).json(proposal);
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: { tender: true }
  });

  if (!proposal || proposal.tender.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const updated = await prisma.proposal.update({
    where: { id },
    data: { status }
  });

  res.json({ message: 'Proposal updated', proposal: updated });
};

exports.deleteProposal = async (req, res) => {
  const { id } = req.params;

  const proposal = await prisma.proposal.findUnique({
    where: { id }
  });

  if (!proposal || proposal.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  await prisma.proposal.delete({ where: { id } });
  res.json({ message: 'Proposal deleted' });
};
