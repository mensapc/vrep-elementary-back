const Answer = require("../models/answer");
const CustomError = require("../utils/CustomError");

class AnswerController {
  createAnswer = async (req, res, next) => {
    const answerData = req.body;
    if (!Array.isArray(answerData)) return res.status(400).send("Answer data must be an array");

    try {
      let response = [];
      for (let i = 0; i < answerData.length; i++) {
        const newAnswer = await Answer.create(answerData[i]);
        response.push(newAnswer);
      }
      res.status(200).json({ answer: response });
    } catch (error) {
      console.error(`Error creating answer: ${error}`);
      next(error);
    }
  };
}

module.exports = AnswerController;
