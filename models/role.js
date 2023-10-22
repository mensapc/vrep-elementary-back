const { Schema, Model, SchemaTypes } = require("firefose");
const { String } = SchemaTypes;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Role = new Model("roles", roleSchema);
module.exports = Role;
