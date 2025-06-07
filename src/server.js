const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

const authRoutes = require('./routes/auth.routes');
const documentRoutes = require('./routes/document.routes');
const userRoutes = require('./routes/user.routes');
const tenderRoutes = require('./routes/tender.routes');
const proposalRoutes = require('./routes/proposal.routes');
const notificationRoutes = require('./routes/notification.routes');
const reviewRoutes = require('./routes/review.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const meRoutes = require('./routes/me.routes');
const searchRoutes = require('./routes/search.routes');
const projectRoutes = require('./routes/project.routes');
const workflowRoutes = require('./routes/workflow.routes');
const apiRoutes = require('./routes/api.routes');
const auditRoutes = require('./routes/audit.routes');




const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Static served:', path.join(__dirname, 'uploads'));

app.use('/auth', authRoutes);
app.use('/documents', documentRoutes);
app.use('/users', userRoutes);
app.use('/tenders', tenderRoutes);
app.use('/proposals', proposalRoutes);
app.use('/notifications', notificationRoutes);
app.use('/reviews', reviewRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/me', meRoutes);
app.use('/search', searchRoutes);
app.use('/projects', projectRoutes);
app.use('/workflow', workflowRoutes);
app.use('/api', apiRoutes);
app.use('/audit', auditRoutes);

app.get('/', (req, res) => {
  res.send('Tender API is running ✅');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
