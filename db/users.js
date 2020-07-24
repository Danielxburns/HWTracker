const mongoose = require('mongoose');

const bgSchema = new mongoose.Schema({
  name: String,
  url: String,
})

let Bg = mongoose.model('Bg', bgSchema)

const userSchema = new mongoose.Schema({
  username: String,
/*   password: String, */
  currBg: bgSchema,
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
  query.currBg = data;
  query.bgList.push(data); // don't push it in here
  query.save((err, result) => {
    if(err) {
      cb(err);
    } else {
      cb(null, result);
    }
  });
};

module.exports = {  getUserData, updatePoints, updateBg };