const express = require("express");
const { validateToken } = require("../middlewares/validations");
const { authorize } = require("../middlewares/authorize");
const OptionController = require("../controllers/option.controller");

const router = express.Router();
const optionController = new OptionController();

router.post(
  "/option",
  validateToken,
  authorize(["createOption"]),
  optionController.createOption
);
router.get(
  "/options/",
  validateToken,
  authorize(["getAllOptions"]),
  optionController.getAllOptions
);
router.get(
  "/options/question/:id",
  validateToken,
  authorize(["readOptionsPerQuestion"]),
optionController.getOptionsByQuestion
);
router.get("/options/:id", validateToken, optionController.getOption);
router.put(
  "/options/:id",
  validateToken,
  authorize(["updateOption"]),
  optionController.updateOption
);
router.delete(
  "/options/:id",
  validateToken,
  authorize(["deleteOption"]),
  optionController.deleteOption
);

module.exports = router;
