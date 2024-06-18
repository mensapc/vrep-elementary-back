import Activity from "../database/models/activity";

import CustomError from "../utils/CustomError";

export const createActivity = async (message: string) => {
  try {
    const activity = new Activity({ message });
    await activity.save();
    return activity;
  } catch (error) {
    throw new CustomError("Error creating activity", 500);
  }
};
