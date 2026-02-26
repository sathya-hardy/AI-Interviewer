const express = require('express');
const sessionMiddleware = require('./middlewares/session.middleware');

const sessionRoutes = require('./routes/session.routes');
const resumeRoutes = require('./routes/resume.routes');
const questionRoutes = require('./routes/question.routes');
const answerRoutes = require('./routes/answer.routes');

const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3002"],
  credentials: true
}));
app.use(sessionMiddleware);

app.use('/session', sessionRoutes);
app.use('/resume', resumeRoutes);
app.use('/questions', questionRoutes);
app.use('/answers', answerRoutes);

module.exports = app;