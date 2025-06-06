const prisma = require('../prisma/client');
const path = require('path');
const fs = require('fs');

exports.upload = async (req, res) => {
  const { originalname, filename, path: filepath } = req.file;
  const { tenderId } = req.body;

  const existing = await prisma.document.findMany({
    where: { userId: req.user.id, filename: originalname }
  });

  const version = (existing.length ? existing.length + 1 : 1);

  const document = await prisma.document.create({
    data: {
      filename: originalname,
      url: `/uploads/${filename}`,
      version,
      userId: req.user.id,
      tenderId: tenderId || null
    }
  });

  res.status(201).json(document);
};

exports.getUserDocuments = async (req, res) => {
  const documents = await prisma.document.findMany({
    where: { userId: req.user.id },
    orderBy: { uploadedAt: 'desc' }
  });
  res.json(documents);
};

exports.getAllDocuments = async (req, res) => {
  const documents = await prisma.document.findMany({
    include: {
      user: { select: { id: true, email: true, name: true, role: true } },
      tender: { select: { id: true, title: true } }
    },
    orderBy: { uploadedAt: 'desc' }
  });

  res.json(documents);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const document = await prisma.document.findUnique({ where: { id } });

  if (!document || document.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const filepath = path.join(__dirname, '..', 'uploads', path.basename(document.url));
  fs.unlinkSync(filepath);

  await prisma.document.delete({ where: { id } });
  res.json({ message: 'Deleted' });
};

exports.getDocumentById = async (req, res) => {
  const { id } = req.params;

  const document = await prisma.document.findUnique({
    where: { id }
  });

  if (!document || document.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json(document);
};

exports.getDocumentsByTender = async (req, res) => {
  const { tenderId } = req.params;

  const documents = await prisma.document.findMany({
    where: {
      tenderId
    },
    orderBy: { uploadedAt: 'desc' }
  });

  res.json(documents);
};