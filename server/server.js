
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('../db/index.js');
/* const [ images ] = require('/images/'); */
const fs = require('fs')

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '/../client')));

app.listen(port, ()=> console.log(`listening on port ${port}.`));

app.get('/getTasks', ((req, res) => {
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

/* ------------ ANCHOR IMAGES ------------ */

app.get('/background', (req, res) => {
  fs.readdir(path.join(__dirname, '/../client/images'), (err, files) => {
      console.log('inside server.getImages files :>> ', files);
      res.send(files);
  });
});
