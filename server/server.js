const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('../db/index.js');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '/../client')));


app.listen(port, ()=> console.log(`listening on port ${port}.`));

app.get('/getTasks', ((req, res) => {
  console.log("inside app.get");
  const today = new Date();
  const diff = today.getDate() - today.getDay() + (today.getDay()? 0 : -6);
  const weekStart = new Date(today.setDate(diff)).toLocaleDateString();
  db.getAllTasks({ "weekStart": weekStart }, (err, data) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.json(data);
    }
  })
}))

app.post('/newTask', ((req, res) => {
  const task = req.body;
  db.postNewTask(task, (err, data) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.json(data);
    }
  });
}));

app.delete('/deleteTask', ((req, res) => {
  console.log('deleteTask req.body: ', req.body);
  const taskId = req.body.taskId;
  db.deleteTask(taskId, (err, data) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.json(data);
    }
  })
}));

app.put('/updateTask', ((req, res) => {
  console.log('updateTask req.body: ', req.body);
  db.updateTask(req.body, (err, data) => {
    if(err) {
    res.status(500).send(err);
  } else {
    res.json(data/* {'!':'RESPONSE FROM DATABASE GOES HERE'} */);
  } })
}));
