const Activity = require('../models/activity');
const moment = require('moment');
const CustomError = require('../utils/CustomError');

const createActivity = async (message) => {
  try {
    const activity = new Activity({ message });
    await activity.save();
    return activity;
  } catch (error) {
    throw new CustomError('Error creating activity', 500);
  }
};

const { groupActivitiesByDays } = require('../utils/utils.activity');

const getActivities = async (req, res, next) => {
  try {
    const today = moment().endOf('day');
    const twoDaysAgo = moment().subtract(2, 'days').startOf('day');
    const activities = await Activity.aggregate([
      {
        $match: {
          created_at: {
            $gte: twoDaysAgo.toDate(),
            $lte: today.toDate(),
          },
        },
      },
      {
        $sort: { created_at: -1 },
      },
    ]);
    const groupedActivities = groupActivitiesByDays(activities);
    res.json(groupedActivities);
  } catch (error) {
    next(error);
  }
};

const updateActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const activity = await Activity.findOneAndUpdate({ _id: id }, data, { new: true });
    if (!activity) {
      throw new CustomError('Activity not found', 404);
    }
    res.json(activity);
  } catch (error) {
    next(error);
  }
};

module.exports = { createActivity, getActivities, updateActivity };
