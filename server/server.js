const cool = require("cool-ascii-faces");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('../db/index.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '/../client')));

app.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/', (req, res) => res.render('pages/index'))
.get('/cool', (req, res) => res.send(cool()))
.get('/times', (req, res) => res.send(showTimes()))

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

showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
}