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

const updateBg = async (userId, data, cb) => {
  const userDoc = await User.findOne({ "_id": userId });
  try {
    const newBg = await new Bg(data)
    const oldBg = await userDoc.bgList.id(data._id)
    if(oldBg) {
      oldBg.set(data);
      userDoc.currBg = oldBg
    } else {
      userDoc.bgList.push(newBg);
      userDoc.currBg = newBg;
    };
    userDoc.save((err, result) => {
      if(err) {
        cb(err);
      } else {
        cb(null, result);
      }
    })
  } catch (err) {
    console.log('there was an error updating the background - err :>> ', err);
  }
};

module.exports = {  getUserData, updatePoints, updateBg };