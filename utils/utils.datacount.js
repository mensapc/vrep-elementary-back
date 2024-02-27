const moment = require('moment');

const Student = require('../models/student');
const CustomError = require('./CustomError');

const getGroupedYearsData = async () => {
  try {
    const currentDate = moment().startOf('year');
    const previousDate = moment().subtract(1, 'year').startOf('year');

    const currentYearData = await Student.aggregate([
      {
        $match: {
          created_at: { $gte: new Date(currentDate), $lt: new Date() },
        },
      },
      {
        $group: {
          _id: { $month: '$created_at' },
          count: { $sum: 1 },
        },
      },
    ]);

    const previousYearData = await Student.aggregate([
      {
        $match: {
          created_at: { $gte: new Date(previousDate), $lt: new Date(currentDate) },
        },
      },
      {
        $group: {
          _id: { $month: '$created_at' },
          count: { $sum: 1 },
        },
      },
    ]);

    return { currentYearData, previousYearData };
  } catch (error) {
    console.error('Error fetching graph data:', error);
    throw CustomError('Error fetching graph data', 500);
  }
};

const getGraphData = async () => {
  try {
    const { currentYearData, previousYearData } = await getGroupedYearsData();

    const graph = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      last_year: Array(12).fill(0),
      this_year: Array(12).fill(0),
    };

    currentYearData.forEach((entry) => {
      graph.this_year[entry._id - 1] = entry.count;
    });

    previousYearData.forEach((entry) => {
      graph.last_year[entry._id - 1] = entry.count;
    });

    return graph;
  } catch (error) {
    console.error('Error fetching graph data:', error);
    throw CustomError('Error fetching graph data', 500);
  }
};

module.exports = { getGraphData };
