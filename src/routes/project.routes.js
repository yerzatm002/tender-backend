const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const {
  createProject, getAllProjects, getProjectById,
  updateProjectStatus, addTask, updateTaskStatus
} = require('../controllers/project.controller');

router.use(auth);

router.post('/', createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.patch('/:id/status', updateProjectStatus);
router.post('/:id/tasks', addTask);
router.patch('/:id/tasks/:taskId', updateTaskStatus);

module.exports = router;
