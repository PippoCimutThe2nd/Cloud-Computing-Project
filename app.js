const mongoose = require('mongoose');
const express = require('express');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const onlyAuthorizedUsers = require('./utils/auth');
require('dotenv').config();

const app = express();
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//These routes could be a separate API
app.use('/auth', authRouter);

app.use(onlyAuthorizedUsers);
app.use('/api', indexRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof SyntaxError) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }

    if (err.status) {
        return res.status(err.status).json({ error: err.message });
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

