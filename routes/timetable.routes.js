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

router.post(
  '/timetable/search',
  validateToken,
  authorize(['getAllTimetables']),
  timetableController.getTimeTableBySearch
);

module.exports = router;
