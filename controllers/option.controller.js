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

  questionwithOptionsAndAnswer = async (question_id) => {
    try {
      const query = new Query().where("question_id", "==", question_id);
      const options = await Option.find(query);
      return options;
    } catch (error) {
      console.error(`Error getting options: ${error}`);
      throw new Error(error);
    }
  };

  updateOption = async (req, res, next) => {
    const { option_id } = req.params;
    const optionData = req.body;
    try {
      const updatedOption = await Option.updateById(option_id, optionData);
      res.status(200).json({ option: updatedOption });
    } catch (error) {
      console.error(`Error updating option: ${error}`);
      next(error);
    }
  };

  deleteOption = async (req, res, next) => {
    const { option_id } = req.params;
    try {
      await Option.deleteById(option_id);
      res.status(200).json({ message: "Option deleted successfully" });
    } catch (error) {
      console.error(`Error deleting option: ${error}`);
      next(error);
    }
  };

  deleteQuestionOptions = async (question_id) => {
    try {
      const query = new Query().where("question_id", "==", question_id);
      const options = await Option.delete(query);
      return options;
    } catch (error) {
      console.error(`Error deleting options: ${error}`);
      throw new Error(error);
    }
  };
}

module.exports = OptionController;