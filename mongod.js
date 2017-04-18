var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', (err) => {
    console.error('connection error: ', err);
})

db.once('open', () => {
    console.log('connect db successfully');
})
