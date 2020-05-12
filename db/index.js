const mongoose = require('mongoose');
const db = mongoose.connection;

let uri = 'mongodb://localhost/hw';

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', () => {
  console.log('connected to hw database');
});

const taskSchema = new mongoose.Schema({
  
})