const prisma = require('../prisma/client');

exports.getAllTenders = async (req, res) => {
  const tenders = await prisma.tender.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(tenders);
};

exports.getTenderById = async (req, res) => {
  const tender = await prisma.tender.findUnique({
    where: { id: req.params.id }
  });
  if (!tender) return res.status(404).json({ error: 'Not found' });
  res.json(tender);
};

exports.createTender = async (req, res) => {
  const { title, description, category, price, deadline, status } = req.body;
  const tender = await prisma.tender.create({
    data: {
      title, description, category, price: parseFloat(price),
      deadline: new Date(deadline), status,
      ownerId: req.user.id
    }
  });
  res.status(201).json(tender);
};

exports.updateTender = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const tender = await prisma.tender.findUnique({ where: { id } });
  if (!tender || tender.ownerId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden' });

  const updated = await prisma.tender.update({
    where: { id },
    data
  });
  res.json(updated);
};

exports.deleteTender = async (req, res) => {
  const { id } = req.params;
  const tender = await prisma.tender.findUnique({ where: { id } });
  if (!tender || tender.ownerId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden' });

  await prisma.tender.delete({ where: { id } });
  res.json({ message: 'Tender deleted' });
};
