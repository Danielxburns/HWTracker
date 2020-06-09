
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('../db/index.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '/../client')));

app.listen(port, ()=> console.log(`listening on port ${port}.`));

app.get('/getTasks', ((req, res) => {
  const today = new Date();
  const diff = today.getDate() - today.getDay() + (today.getDay()? 0 : -6);
  const weekStart = new Date(today.setDate(diff)).toLocaleDateString();
console.log('inside server.app.get');
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
  console.log('inside server.app.post "/newTask" req.body :>> ', req.body);
  db.postNewTask(task, (err, data) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.json(data);
    }
  });
}));

app.delete('/deleteTask', ((req, res) => {
  db.deleteTask(req.body._id, (err, data) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.json(data);
    }
  })
}));

app.put('/updateTask', ((req, res) => {
  db.updateTask(req.body, (err, data) => {
    if(err) {
    res.status(500).send(err);
  } else {
    res.json(data);
  } })
}));
