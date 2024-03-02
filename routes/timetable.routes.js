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
  '/timetable/staff/:id',
  validateToken,
  authorize(['getTimetable']),
  timetableController.getTimetableByStaff
);

router.put(
  '/timetable/update',
  validateToken,
  authorize(['updateTimetable']),
  timetableController.updateTimetable
);

router.put(
  '/timetable/remove',
  validateToken,
  authorize(['deleteTimetable']),
  timetableController.removeTimetable
);

module.exports = router;
