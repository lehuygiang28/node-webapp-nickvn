const User = require('../app/models/User');


async function renewUserSession(_req, next) {
  
  if (!_req.session.User) {
    console.log('Can not get session');
    return;
  }

  console.log('Get session completed userName: ' + _req.session.User.userName);
  User.findById(_req.session.User._id)
    .then((user) => {
      _req.session.User = {
        _id: user._id,
        userName: user.userName,
        money: user.money,
        role: user.role
      }
      console.log('Set session completed userName: ' + _req.session.User.userName);
    }).catch(next);
}

module.exports = { renewUserSession };