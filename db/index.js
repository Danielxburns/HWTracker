const mongoose = require('mongoose');
const db = mongoose.connection;

let uri = 'mongodb://localhost/hw';

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', () => {
  console.log('connected to hw database');
});

const taskSchema = new mongoose.Schema({
  subject: String,
  day: String,
  task: String,
  taskId: String,
  createdOn: Date,
  modifiedOn: Date,
  done: Boolean
});

let Task = mongoose.model('Task', taskSchema);

const postNewTask = (task, cb) => {
  console.log(`inside postNewTask`);
  console.log('task :>> ', task);
  const newTask = new Task(task);
  newTask.save((err, result) => {
    if(err) { 
      cb(err)
    } else {
      cb(null, result);
    }
  });
};

const deleteTask = (taskId, cb) => {
  console.log('inside deleteTask - taskId :>> ', taskId);
  Task.deleteOne({"taskId": taskId}, ((err, result) => {
    if(err) {
      cb(err);
    } else {
      cb(null, result);
    }
  }));
}

module.exports = { postNewTask, deleteTask }