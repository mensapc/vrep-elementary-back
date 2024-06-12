import express,{Router} from 'express'
const { validateToken } = require('../../../middlewares/validations');
const { authorize } = require('../../../middlewares/authorize');
import ActivityController from '../controllers/activityController';

const activityController = new ActivityController();
const router:Router = express.Router();

router.get('/activities',activityController.getActivities);
router.put('/activities/:id',activityController.updateActivity);
router.delete('/activities/:id',activityController.deleteActivity);
router.post('/activities',activityController.createActivity);


//should add this as middlewares after i done to update the middlewares to ts
// validateToken, authorize(['activities'])

export default router;