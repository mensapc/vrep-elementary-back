import { ActivityInterface } from "../interfaces/activityInterface";
import ActivityRepository from "../repoitories/activityRepository";
import moment from "moment";
const { groupActivitiesByDays } = require('../../../utils/utils.activity');

export default class ActivityService {
  private activityRepository: ActivityRepository;

  constructor() {
    this.activityRepository = new ActivityRepository();
  }

  getActivities = async() =>{
    const today = moment().endOf('day').toDate();
    const twoDaysAgo = moment().subtract(2, 'days').startOf('day').toDate();
    const activities = await this.activityRepository.findByDate(twoDaysAgo,today);
    return groupActivitiesByDays(activities);
  }

  createActivity = async(activity:ActivityInterface) =>{
    return await this.activityRepository.create(activity);
  }

  updateActivity = async(id:string, activity:ActivityInterface) =>{
    return await this.activityRepository.update(id,activity);
  }

  deleteActivity = async(id:string) =>{
    return await this.activityRepository.delete(id)
  }
}
