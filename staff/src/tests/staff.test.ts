import request from "supertest";
import PreRegistrationModel from "../database/models/pregistration";
import Staff from "../database/models/staff";
import Class from "../database/models/class";
import Course from "../database/models/course";
import { validateToken } from "../api/middlewares/validations";
import bcrypt from "bcrypt";
import { createActivity } from "../services/activity-service";

import { app } from "../app";

jest.mock("../database/models/pregistration");
jest.mock("../database/models/staff");
jest.mock("../database/models/class");
jest.mock("../database/models/course");
jest.mock("../api/middlewares/validations");
jest.mock("../services/activity-service");

afterEach(() => {
  jest.clearAllMocks();
});

describe("/api/v2/staff/register/:token", () => {
  test("/api/v2/staff/register/mock-token", async () => {
    (PreRegistrationModel.findOne as jest.Mock)
      .mockReturnValueOnce({
        tokens: "mock-token",
        expires: new Date().setDate(new Date().getDate() + 1),
        email: "test@test.com",
      })
      .mockReturnValueOnce({
        email: "test@test.com",
      });

    (Staff.findOne as jest.Mock).mockResolvedValue(undefined);
    (Class.findOne as jest.Mock).mockResolvedValue({ name: "test-class" });
    (Staff.create as jest.Mock).mockResolvedValue({
      _doc: {
        email: "test@test.com",
        password: "123234213",
        first_name: "test",
        last_name: "user",
        className: "test-class",
        address: "test-address",
        phone_number: "39842342",
      },
    });

    (Class.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue({}),
    }));

    const response = await request(app)
      .post("/api/v2/staff/register/mock-token")
      .set("Authorization", `Bearer token`)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send({
        email: "test@test.com",
        password: "123234213",
        first_name: "test",
        last_name: "user",
        className: "test-class",
        address: "test-address",
        phone_number: "39842342",
      });

    expect(response.status).toBe(201);
  });
});

describe("/api/v2/staff/course/:testId", () => {
  test("/api/v2/staff/course/courseId", async () => {
    (validateToken as jest.Mock).mockImplementation((req, res, next) => {
      req.user = {
        first_name: "test",
        last_name: "user",
        role: "admin",
      };
      next();
    });

    (Staff.findOne as jest.Mock).mockResolvedValue({
      first_name: "test",
      last_name: "user",
      role: "admin",
    });
    (Course.findById as jest.Mock).mockResolvedValue({ id: "test-course" });
    (Course.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue({ save: jest.fn() }),
    }));
    const response = await request(app)
      .put("/api/v2/staff/course/test-course")
      .set("Authorization", `Bearer token`)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send({
        first_name: "test",
        last_name: "user",
      });
    expect(response.status).toBe(200);
  });
});

describe("/api/v2/staff/class/:classId", () => {
  test("/api/v2/staff/class/classId", async () => {
    (validateToken as jest.Mock).mockImplementation((req, res, next) => {
      req.user = {
        first_name: "test",
        last_name: "user",
        role: "admin",
      };
      next();
    });
    (Staff.findOne as jest.Mock).mockResolvedValue({
      first_name: "test",
    });
    (Class.findById as jest.Mock).mockResolvedValue({ id: "test-class" });
    (Class.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue({ save: jest.fn() }),
    }));
    const response = await request(app)
      .put("/api/v2/staff/class/test-class")
      .set("Authorization", `Bearer token`)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send({
        first_name: "test",
      });
    expect(response.status).toBe(200);
  });
});

describe("/api/v2/staff/login", () => {
  test("/api/v2/staff/login", async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("12345678", salt);

    (Staff.findOne as jest.Mock).mockResolvedValue({
      email: "test@test.com",
      password: hashedPassword,
      _doc: {
        email: "test@test.com",
        password: hashedPassword,
      },
    });

    const response = await request(app)
      .post("/api/v2/staff/login")
      .set("Authorization", `Bearer token`)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send({
        email: "test@test.com",
        password: "12345678",
      });
    expect(response.status).toBe(200);
  });
});

describe("/api/v2/staff", () => {
  test("/api/v2/staff", async () => {
    (Staff.find as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        select: jest.fn().mockResolvedValue({}),
      })),
    }));
    const response = await request(app)
      .get("/api/v2/staff")
      .set("Authorization", `Bearer token`);
    expect(response.status).toBe(200);
  });
});

describe("/api/v2/staff/:staffId", () => {
  test("/api/v2/staff/staffId", async () => {
    (Staff.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({}),
    }));
    const response = await request(app)
      .get("/api/v2/staff/test-staffId")
      .set("Authorization", `Bearer token`);
    expect(response.status).toBe(200);
  });
});

describe("/api/v2/staff/:staffId", () => {
  test("/api/v2/staff/12345", async () => {
    (Staff.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
      select: jest
        .fn()
        .mockResolvedValue({ first_name: "test", last_name: "test" }),
    }));
    (createActivity as jest.Mock).mockResolvedValue({});
    const response = await request(app)
      .put("/api/v2/staff/test-staffId")
      .set("Authorization", `Bearer token`)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send({
        password: "12345678",
        _id: "123",
      });
    expect(response.status).toBe(201);
  });
});

describe("/api/v2/staff/:staffId", () => {
  test("/api/v2/staff/staffId", async () => {
    (Staff.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: "1234" });
    const response = await request(app)
      .delete("/api/v2/staff/test-staffId")
      .set("Authorization", `Bearer token`);
    console.log(response.body);
    expect(response.status).toBe(204);
  });
});
