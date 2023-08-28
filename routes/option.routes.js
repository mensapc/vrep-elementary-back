const express = require("express");
const { validateToken } = require("../middlewares/validations");
const { authorize } = require("../middlewares/authorize");
const OptionController = require("../controllers/option.controller");
const { route } = require("./exam.routes");

const router = express.Router();
const optionController = new OptionController();

router.post("/options", validateToken, authorize(["createOption"]), optionController.createOption);

module.exports = router;
