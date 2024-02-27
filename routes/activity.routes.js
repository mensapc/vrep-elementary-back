const express = require('express');
const { validateToken } = require('../middlewares/validations');
const { authorize } = require('../middlewares/authorize');
const { getActivities, updateActivity } = require('../controllers/activity.controller');

const router = express.Router();

router.get('/activities', validateToken, authorize(['activities']), getActivities);
router.put('/activities/:id', validateToken, authorize(['activities']), updateActivity);

module.exports = router;
