const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../docs/swagger.json');
const auth = require('../middlewares/auth.middleware');

router.get('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

router.post('/integrate/crm', auth, (req, res) => {
  // handle CRM sync
  res.json({ message: 'CRM integration complete (mock)' });
});

router.post('/integrate/1c', auth, (req, res) => {
  // handle 1C sync
  res.json({ message: '1C integration complete (mock)' });
});

module.exports = router;
