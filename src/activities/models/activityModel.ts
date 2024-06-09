import { Schema, model, models } from 'mongoose';
import { ActivityInterface } from '../interfaces/activityInterface';

const activitySchema = new Schema<ActivityInterface>({
  message: {
    type: String,
    required: true,
  }
});

const Activity = models.Activity || model<ActivityInterface>('Activity', activitySchema);

export default Activity;
