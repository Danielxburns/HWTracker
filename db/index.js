const mongoose = require('mongoose');
const db = mongoose.connection;

let uri = 'mongodb://heroku_40smgss9:hsps39cdhdebtrtvvldj15dl4b@ds019856.mlab.com:19856/heroku_40smgss9'; /* 'mongodb://localhost/hw'; */

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, 'useFindAndModify': false});

db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', () => {
  console.log('connected to hw database');
});
