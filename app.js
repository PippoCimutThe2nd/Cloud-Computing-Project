const mongoose = require('mongoose');
const express = require('express');
const dotevn = require('dotenv');
const indexRouter = require('./routes/index');
const activityRouter = require('./routes/activity');
const authRouter = require('./routes/auth');
const jsonwebtoken = require('jsonwebtoken');
const ObjectId = mongoose.Types.ObjectId;
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
    res.status(500).json({ error: 'Internal server error' });
});

mongoose.connect(MONGO_URL).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

function auth(req, res, next) {
    if (!req.headers['authorization']) {
        return res.status(401).send({ message: 'Access denied' })
    }

    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'Access denied' })
    }
    try {
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).send({ message: 'Invalid token' })
    }
}