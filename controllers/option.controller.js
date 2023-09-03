const { Query } = require("firefose");
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

  getQuestionOptions = async (question_id) => {
    try {
      const query = new Query().where("question_id", "==", question_id);
      const options = await Option.find(query);
      return options;
    } catch (error) {
      console.error(`Error getting options: ${error}`);
      throw new Error(error);
    }
  };
}

module.exports = OptionController;
