import express from "express";
import StaffController from "../services/staff-service";
import { authorize } from "./middlewares/authorize";
import { validateToken } from "./middlewares/validations";
import multerMiddleware from "./middlewares/multer.middleware";
const staffController = new StaffController();
const router = express.Router();

router.post("/staff/register/:id", multerMiddleware, staffController.register);
router.put(
  "/staff/course/:id",
  validateToken,
  authorize(["staffToCourse"]),
  staffController.addStaffToCourse
);
router.put(
  "/staff/class/:id",
  validateToken,
  authorize(["staffToClass"]),
  staffController.addStaffToClass
);
router.post("/staff/login", staffController.login);

router.get(
  "/staff",
  validateToken,
  authorize(["readStaff"]),
  staffController.getAll
);

router.get(
  "/staff/:id",
  validateToken,
  authorize(["readStaff"]),
  staffController.getById
);

router.put(
  "/staff/:id",
  validateToken,
  authorize(["updateStaff"]),
  multerMiddleware,
  staffController.updateStaff
);

router.post(
  "/staff/sort",
  validateToken,
  authorize(["readStaff"]),
  staffController.staffBySort
);

router.delete(
  "/staff/:id",
  validateToken,
  authorize(["deleteStaff"]),
  staffController.deleteStaff
);

export default router;
