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
const datacountRoutes = require('./routes/datacount.routes');
const resultRoutes = require('./routes/result.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:5500',
      'https://rpms-admin.vercel.app',
      'https://pupils.rulerspalacemontessori.com.ng',
      'https://rpms-pupil.vercel.app',
      'https://rpms-teachers.vercel.app',
      'https://rpmsteachersaccess.rulerspalacemontessori.com.ng',
    ],
  })
);

const PORT = process.env.PORT || 8080;

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
app.use('/api/v1', datacountRoutes);
app.use('/api/v1', resultRoutes);

app.use(errorMiddleware);

app.get('/', (req, res) => res.status(200).send('Welcome to the RPMS API'));

connectDB(process.env.MONGODB_URL);
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
