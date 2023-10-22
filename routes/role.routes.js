const express = require("express");
const RoleController = require("../controllers/role.controller");
const { authorize } = require("../middlewares/authorize");
const { validateToken } = require("../middlewares/validations");

const router = express.Router();
const roleController = new RoleController();

router.post("/roles", validateToken, authorize(["createRole"]), roleController.create);
router.get("/roles", validateToken, authorize(["readRoles"]), roleController.getAll);
router.get("/roles/:id", validateToken, roleController.getById);

module.exports = router;
