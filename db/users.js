const mongoose = require('mongoose');

const bgSchema = new mongoose.Schema({
  name: String,
  url: String,
})

let Bg = mongoose.model('Bg', bgSchema)

const userSchema = new mongoose.Schema({
  username: String,
/*   password: String, */
  currBg: String,
  bgList: [bgSchema],
  points: Number,
});

let User = mongoose.model('User', userSchema);

const getUserData = (user, cb) => {
  User.findOne(user, ((err, result) => {
    if(err) {
      cb(err)
    } else {
      cb(null, result);
    }
  }));
};
const updatePoints = async (data, cb) => {
  const query = await User.findOne({ username: data.username });
  query.points = data.points;
  query.save((err, result) => {
    if(err) {
      cb(err);
    } else {
      cb(null, result);
    }
  });
};

const updateBg = async (user, data, cb) => {
  const query = await User.findOne(user);
  query.currBg = data.url;
  console.log('inside db/users.updateBg - data :>> ', data);
  console.log('inside db/users.updateBg - query.bgList :>> ', query.bgList);
  query.bgList.push(data);
  console.log('query.bgList :>> ', query.bgList);
  query.save((err, result) => {
    if(err) {
      cb(err);
    } else {
      cb(null, result);
    }
  });
};

module.exports = {  getUserData, updatePoints, updateBg };