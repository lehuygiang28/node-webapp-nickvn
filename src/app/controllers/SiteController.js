const User = require('../models/User');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {

  // GET homepage
  home(_req, res, next) {

    User.find({})
      .then(users => res.render('home', {
        users: mutipleMongooseToObject(users)
      }))
      .catch(next);

    // res.render('home');
  }

  // GET dang-nhap
  login(_req, res) {
    res.render('dang-nhap');
  }

  signup(_req, res) {
    res.render('dang-ky');
  }

}

// export default new DangNhapController;
module.exports = new SiteController;