const mongoose = require('mongoose');
const db = mongoose.connection;

let uri = 'mongodb://localhost/hw';

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, 'useFindAndModify': false});

db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', () => {
  console.log('connected to hw database');
});

const taskSchema = new mongoose.Schema({
  subject: String,
  day: String,
  task: String,
  createdOn: Date,
  modifiedOn: Date,
  weekStart: String,
  weekEnd: String,
  done: Boolean
});

let Task = mongoose.model('Task', taskSchema);

const getAllTasks = (weekStart, cb) => {
  Task.find(weekStart, ((err, result) => {
    if(err) {
      cb(err)
    } else {
      cb(null, result);
    }
  }));
};

const postNewTask = (task, cb) => {
  const newTask = new Task(task);
  newTask.save((err, result) => {
    if(err) { 
      cb(err)
    } else {
      cb(null, result);
    }
  });
};

const deleteTask = (id, cb) => {
  Task.deleteOne({"_id": id}, ((err, result) => {
    if(err) {
      cb(err);
    } else {
      cb(null, result);
    }
  }));
};

const updateTask = async (data, cb) => {
  const query = await Task.findOne({"_id": data._id});
  query.task = data.task;
  query.done = data.done;
  query.modifiedOn = data.modifiedOn;
  query.save((err, result) => {
    if(err) {
      cb(err);
    } else {
      cb(null, result);
    }
  });
};

module.exports = { getAllTasks, postNewTask, deleteTask, updateTask };
