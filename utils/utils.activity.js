const moment = require('moment');

const groupActivitiesByDays = (activities) => {
  const groupedActivities = {
    this_day: [],
    yesterday: [],
    two_days_ago: [],
  };
  const today = moment().endOf('day');

  activities.forEach((activity) => {
    const createdAt = moment(activity.created_at);
    if (createdAt.isSame(today, 'day')) {
      groupedActivities.this_day.push(activity);
    } else if (createdAt.isSame(today.clone().subtract(1, 'day'), 'day')) {
      groupedActivities.yesterday.push(activity);
    } else {
      groupedActivities.two_days_ago.push(activity);
    }
  });

  return groupedActivities;
};

module.exports = { groupActivitiesByDays };
