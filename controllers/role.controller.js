const { Query } = require("firefose");
const Role = require("../models/role");
const CustomError = require("../utils/CustomError");

class RoleController {
  create = async (req, res, next) => {
    const { name } = req.body;
    try {
      const query = new Query().where("name", "==", name);
      const roleExists = await Role.find(query);
      if (roleExists.length > 0) throw new CustomError("Role already exists", 400);

      const newRole = await Role.create({ name });
      res.status(200).json({ role: newRole });
    } catch (error) {
      console.error(`Error creating role: ${error}`);
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const roles = await Role.find(new Query());
      res.status(200).json({ roles });
    } catch (error) {
      console.error(`Error getting roles: ${error}`);
      next(error);
    }
  };

  getById = async (req, res, next) => {
    const { id } = req.params;
    try {
      const role = await Role.findById(id);
      if (!role) throw new CustomError("Role not found", 404);
      res.status(200).json({ role });
    } catch (error) {
      console.error(`Error getting role: ${error}`);
      next(error);
    }
  };

  findById = async (id) => {
    try {
      const role = await Role.findById(id);
      return role;
    } catch (error) {
      console.error(`Error getting role: ${error}`);
      throw new Error(error);
    }
  };
}

module.exports = RoleController;
