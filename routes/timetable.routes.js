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
  '/timetables/search',
  validateToken,
  authorize(['getAllTimetables']),
  timetableController.getTimeTableBySearch
);

router.put(
  '/timetables/:id',
  validateToken,
  authorize(['updateTimetable']),
  timetableController.updateTimetable
);

router.delete(
  '/timetables/:id',
  validateToken,
  authorize(['deleteTimetable']),
  timetableController.deleteTimetable
);

module.exports = router;
