import { ActivityInterface } from "../interfaces/activityInterface";
import activityModel from "../models/activityModel";

export default class ActivityRepository {
  async findByDate(startDate: Date, endDate: Date) {
    return await activityModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $sort: { created_at: -1 },
      },
    ]);
  }

  async create(activity: ActivityInterface) {
    return await activityModel.create(activity);
  }

  async update(id: string, activity: ActivityInterface) {
    return await activityModel.findByIdAndUpdate(id, activity, { new: true });
  }

  async delete(id: string) {
    return await activityModel.findByIdAndDelete(id);
  }
}
