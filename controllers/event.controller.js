const Event = require('../models/event');

class EventController {
  createEvent = async (req, res, next) => {
    const data = req.body;
    try {
      const newEvent = await Event.create(data);
      res.status(201).send(newEvent);
    } catch (error) {
      console.error(`Error in creating Event: ${error.message}`);
      next(error);
    }
  };
}

module.exports = EventController;
