const express = require('express');
const { validateToken } = require('../middlewares/validations');
const { authorize } = require('../middlewares/authorize');
const OptionController = require('../controllers/option.controller');
const { route } = require('./exam.routes');

const router = express.Router();
const optionController = new OptionController();

router.post('/option', validateToken, authorize(['createOption']), optionController.createOption);
router.get('/options/:id', validateToken, optionController.getOption);
router.put(
  '/options/:option_id',
  validateToken,
  authorize(['updateOption']),
  optionController.updateOption
);
router.delete(
  '/options/:option_id',
  validateToken,
  authorize(['deleteOption']),
  optionController.deleteOption
);

module.exports = router;
