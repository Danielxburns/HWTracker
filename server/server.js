const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '/../client')));


app.listen(port, ()=> console.log(`listening on port ${port}.`));

app.post('/newTask', ((req, res) => {
  console.log('app.post req.body: ', req.body);
  res.json({'!':'RESPONSE FROM DATABASE GOES HERE'});
}));

app.delete('/deleteTask', ((req, res) => {
  console.log('app.delete req.body: ', req.body);
  res.json({'!':'RESPONSE FROM DATABASE GOES HERE'});
}))

app.put('/toggleDone', ((req, res) => {
  console.log('app.put req.body: ', req.body);
  res.json({'!':'RESPONSE FROM DATABASE GOES HERE'});
}))
