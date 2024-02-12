const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error.middleware');
require('dotenv').config();
const connectDB = require('./config/db.js');
const adminRoutes = require('./routes/admin.routes');
const studentRoutes = require('./routes/student.routes');
// const staffRoutes = require('./routes/staff.routes');
// const courseRoutes = require('./routes/course.route');
// const classRoutes = require('./routes/class.route');
// const examRoutes = require('./routes/exam.routes');
// const questionRoutes = require('./routes/question.routes');
// const optionRoutes = require('./routes/option.routes');
// const answerRoutes = require('./routes/answer.routes');
// const gradeRoutes = require('./routes/grade.routes');
// const attendanceRoutes = require('./routes/attendance.routes');

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
// app.use('/', staffRoutes);
// app.use('/', courseRoutes);
// app.use('/', classRoutes);
// app.use('/api/v1', examRoutes);
// app.use('/api/v1', questionRoutes);
// app.use('/api/v1', optionRoutes);
// app.use('/api/v1', answerRoutes);
// app.use('/api/v1', gradeRoutes);
// app.use('/api/v1', attendanceRoutes);

app.use(errorMiddleware);

app.get('/', (req, res) => res.status(200).send('Welcome to the RPMS API'));

connectDB(process.env.MONGODB_URL);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
