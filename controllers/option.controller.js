const Option = require("../models/option");

class OptionController {
  createOption = async (req, res, next) => {
    const optionData = req.body;

    try {
      const newOption = await Option.create(optionData);
      res.status(200).json({ option: newOption });
    } catch (error) {
      console.error(`Error creating option: ${error}`);
      next(error);
    }
  };
}

module.exports = OptionController;
