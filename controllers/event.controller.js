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

  getAllEvents = async (req, res, next) => {
    try {
      const events = await Event.find();
      res.status(200).json(events);
    } catch (error) {
      console.error(`Error retrieving all events `, error);
      next(error);
    }
  };

  getEventBySearch = async (req, res, next) => {
    const query = req.query;
    try {
      const events = await Event.find(query);
      res.status(200).json(events);
    } catch (error) {
      console.error(`Error retrieving event by search`, error);
      next(error);
    }
  };

  updateEvent = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const event = await Event.findOneAndUpdate(
        {
          _id: id,
        },
        data,
        { new: true }
      );
      if (!event) throw new CustomError('Event not found', 404);
      res.status(200).json(event);
    } catch (error) {
      console.error(`Error updating event: ${error.message}`);
      next(error);
    }
  };

  deleteEvent = async (req, res, next) => {
    const { id } = req.params;
    try {
      const event = await Event.findOneAndDelete({ _id: id });
      if (!event) throw new CustomError('Event not found', 404);
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error(`Error deleting event: ${error.message}`);
      next(error);
    }
  };
}

module.exports = EventController;
