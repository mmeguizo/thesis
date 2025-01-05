const express = require('express');
const app = express();
const uploadRouter = require('./routes/upload');

app.use('/uploads', express.static('uploads'));
app.use('/api/upload', uploadRouter); 