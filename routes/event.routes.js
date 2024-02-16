const express = require('express');
const EventController = require('../controllers/event.controller');
const { authorize } = require('../middlewares/authorize');
const { validateToken } = require('../middlewares/validations');

const router = express.Router();
const eventController = new EventController();

router.post('/event', validateToken, authorize(['createEvent']), eventController.createEvent);
router.get('/events', validateToken, authorize(['getAllEvents']), eventController.getAllEvents);
router.post(
  '/events/search',
  validateToken,
  authorize(['getAllEvents']),
  eventController.getEventBySearch
);

module.exports = router;
