const mongoose = require('mongoose');
const express = require('express');
const dotevn = require('dotenv');
const indexRouter = require('./routes/index');
const activityRouter = require('./routes/activity');
dotevn.config();

const app = express();
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use((req, res, next) => {
    req.user = {
        id: new mongoose.Types.ObjectId("67464b0f90bb9c12b59b5b51"),
        username: 'testuser'
    };
    next();
});

app.use('/', indexRouter);
app.use('/activity', activityRouter);

mongoose.connect(MONGO_URL).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});