const express = require('express');
const TimetableController = require('../controllers/timetable.controller');
const { authorize } = require('../middlewares/authorize');
const { validateToken } = require('../middlewares/validations');

const router = express.Router();
const timetableController = new TimetableController();

router.post(
  '/timetable',
  validateToken,
  authorize(['createTimetable']),
  timetableController.createTimetable
);

router.get(
  '/timetables',
  validateToken,
  authorize(['getAllTimetables']),
  timetableController.getAllTimetables
);

module.exports = router;
