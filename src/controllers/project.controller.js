const prisma = require('../prisma/client');

exports.createProject = async (req, res) => {
  const { title, deadline, tenderId } = req.body;

  const project = await prisma.project.create({
    data: {
      title,
      deadline: new Date(deadline),
      tenderId,
      ownerId: req.user.id
    }
  });

  res.status(201).json(project);
};

exports.getAllProjects = async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { ownerId: req.user.id },
    include: { tender: true },
    orderBy: { deadline: 'asc' }
  });
  res.json(projects);
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tasks: true,
      tender: true
    }
  });

  if (!project || project.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json(project);
};

exports.updateProjectStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await prisma.project.update({
    where: { id },
    data: { status }
  });

  res.json(updated);
};

exports.addTask = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const task = await prisma.task.create({
    data: {
      title,
      projectId: id
    }
  });

  res.status(201).json(task);
};

exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { status }
  });

  res.json(updated);
};
