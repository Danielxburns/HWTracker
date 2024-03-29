
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const connection = require('../db/index.js');
const users = require('../db/users');
const tasks = require('../db/tasks');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '/../client')));

app.listen(port, ()=> console.log(`listening on port ${port}.`));

app.get('/getUserData/:user', ((req, res) => {
  const user = {"username": req.params.user};
    users.getUserData(user, (err, data) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.json(data);
    }
  })
}));

app.get('/getTasks/:wkStart', ((req, res) => {
  const weekStart = req.params.wkStart.replace(/-/g, "/");
  
  tasks.getAllTasks({ "weekStart": weekStart }, (err, data) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.json(data);
    }
  })
}))

app.post('/newTask', ((req, res) => {
  const task = req.body;
  tasks.postNewTask(task, (err, data) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.json(data);
    }
  });
}));

app.put('/updateTask', ((req, res) => {
  tasks.updateTask(req.body, (err, data) => {
      if(err) {
      res.status(500).send(err);
    } else {
      res.json(data);
    }
  })
}));

app.delete('/deleteTask', ((req, res) => {
  tasks.deleteTask(req.body._id, (err, data) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.json(data);
    }
  })
}));

app.put('/updatePoints', ((req, res) => {
  users.updatePoints(req.body, (err, data) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.json(data)
    }
  })
}));

app.put('/bg/:user', ((req, res)=> {
  const user = { "_id": req.params.user };
  users.updateBg(user, req.body, (err, data) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.json(data);
    }
  });
}));

app.put('/wl/:user', ((req, res)=> {
  const user = { "_id": req.params.user };
  users.updateWl(user, req.body, (err, data) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.json(data);
    }
  });
}));

/* ------------ ANCHOR IMAGES ------------ */

app.get('/background', (req, res) => {
  fs.readdir(path.join(__dirname, '/../client/images'), (err, files) => {
      res.send(files);
  });
});
