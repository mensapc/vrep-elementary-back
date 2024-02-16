const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error.middleware');
require('dotenv').config();
const connectDB = require('./config/db.js');
const adminRoutes = require('./routes/admin.routes');
const studentRoutes = require('./routes/student.routes');
const staffRoutes = require('./routes/staff.routes');
const courseRoutes = require('./routes/course.routes');
const classRoutes = require('./routes/class.routes');
const examRoutes = require('./routes/exam.routes');
const questionRoutes = require('./routes/question.routes');
const optionRoutes = require('./routes/option.routes');
const answerRoutes = require('./routes/answer.routes');
const gradeRoutes = require('./routes/grade.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const timetableRoutes = require('./routes/timetable.routes');
const eventRoutes = require('./routes/event.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://rpms-web-server.onrender.com'],
  })
);

const PORT = process.env.NODE_ENV || 8080;

app.use('/', adminRoutes);
app.use('/', studentRoutes);
app.use('/', staffRoutes);
app.use('/api/v1', courseRoutes);
app.use('/api/v1', classRoutes);
app.use('/api/v1', examRoutes);
app.use('/api/v1', questionRoutes);
app.use('/api/v1', optionRoutes);
app.use('/api/v1', answerRoutes);
app.use('/api/v1', gradeRoutes);
app.use('/api/v1', attendanceRoutes);
app.use('/api/v1', timetableRoutes);
app.use('/api/v1', eventRoutes);

app.use(errorMiddleware);

app.get('/', (req, res) => res.status(200).send('Welcome to the RPMS API'));

connectDB(process.env.MONGODB_URL);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
