const calculateMarks = (exam, questionsWithAnswers) => {
  const totalPoints = questionsWithAnswers.reduce((acc, question) => acc + question.points, 0);

  const studentMarks = questionsWithAnswers.reduce((acc, question) => {
    const selectedOption = question.options.find(
      (option) => option.id === question.answer[0].option_id
    );
    return acc + (selectedOption.is_correct ? question.points : 0);
  }, 0);

  return (studentMarks / totalPoints) * exam.max_score;
};

module.exports = { calculateMarks };
