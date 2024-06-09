import { ActivityInterface } from "../interfaces/activityInterface";
import ActivityService from "../services/activityService";
import  {Request, Response, NextFunction} from 'express'
import CustomError from "../../utils/customError";
export default class ActivityController{
    private activityService:ActivityService;

    constructor(){
        this.activityService = new ActivityService();
    }

    getActivities = async(req:Request, res:Response, next:NextFunction) =>{
        try {
            const groupedActivities = await this.activityService.getActivities();
            res.status(200).json(groupedActivities)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    createActivity = async(req:Request, res:Response, next:NextFunction) =>{
        try {
            const activity:ActivityInterface = req.body;
            if (!activity) {
                throw new CustomError('Activity data is missing', 400);
              }
            const _createActivity = await this.activityService.createActivity(activity);
            res.status(201).json(_createActivity);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    deleteActivity = async(req:Request, res:Response, next:NextFunction) =>{
        try {
            const id = req.params.id;
            if(!id) throw new CustomError('Activity id is required', 400);
            const _deleteActivity = await this.activityService.deleteActivity(id);
            if(!_deleteActivity) throw new CustomError('Activity not found',404)
            res.status(204).json(_deleteActivity);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    updateActivity = async(req:Request, res:Response, next:NextFunction) =>{
        try {
            const id = req.params.id;
            const activity = req.body;
            if(!id || !activity) throw new CustomError('Missing activity body or id',400)
            const _updateActivity = await this.activityService.updateActivity(id,activity)
            if(!_updateActivity) throw new CustomError('Activity not found',404)
            res.status(200).json(_updateActivity);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}