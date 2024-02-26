const calculateAttendance = (data) => {
  const attendance = {
    present_days: 0,
    total_days: 0,
    percentage: 100,
  };

  data.forEach((item) => {
    if (item.attendance_status === 'Present') {
      attendance.present_days += 1;
    }
    attendance.total_days += 1;
  });

  if (attendance.total_days > 0) {
    attendance.percentage = (attendance.present_days / attendance.total_days) * 100;
  }
  return attendance;
};

module.exports = { calculateAttendance };
