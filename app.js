const mongoose = require('mongoose');
const express = require('express');
const dotevn = require('dotenv');
const indexRouter = require('./routes/index');
const activityRouter = require('./routes/activity');
const authRouter = require('./routes/auth');
const auth = require('./utils/auth');
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

app.use('/auth', authRouter);
app.use(auth);

app.use('/', indexRouter);
app.use('/activity', activityRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof SyntaxError) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }

    if (err.message) {

        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }

        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Internal server error' });
});

mongoose.connect(MONGO_URL).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

