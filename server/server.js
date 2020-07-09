
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('../db/index.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '/../client')));

app.listen(port, ()=> console.log(`listening on port ${port}.`));

app.get('/getTasks/:wkStart', ((req, res) => {
  const weekStart = req.params.wkStart.replace(/-/g, "/");
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
