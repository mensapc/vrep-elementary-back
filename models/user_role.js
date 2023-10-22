const { Schema, Model, SchemaTypes } = require("firefose");
const { String } = SchemaTypes;

const userRoleSchema = new Schema({
  role_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});

const UserRole = new Model("user_roles", userRoleSchema);
module.exports = UserRole;
