const express = require('express');
const { validateToken } = require('../middlewares/validations');
const { authorize } = require('../middlewares/authorize');
const GradeController = require('../controllers/grade.controller');

const router = express.Router();
const gradeController = new GradeController();

router.post('/grade', validateToken, gradeController.createGrade);
router.get(
  '/grades/search',
  validateToken,
  authorize(['searchGrade']),
  gradeController.getGradesBySearch
);
router.put('/grades/:id', validateToken, gradeController.updateGrade);

module.exports = router;
