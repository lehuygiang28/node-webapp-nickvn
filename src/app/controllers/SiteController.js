const User = require('../models/User');
const Category = require('../models/Category');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {

  // GET homepage
  home(_req, res, next) {

    Category.find({})
      .then(categories => res.render('home', {
        categories: mutipleMongooseToObject(categories)
      }))
      .catch(next);

  }

  // POST /dang-nhap
  loginSovle(_req, res, next) {
    console.log(_req.body.username + _req.body.password)
    User.findOne({ userName: _req.body.username, password: _req.body.password })
      .then(user => res.render('dang-nhap', {
        user: mongooseToObject(user)
      }))
      .catch(err => next(err));

    
    // User.findOne({ userName: _req.body.username, password: _req.body.password })
    //   .then(user => res.json( {
    //     user: mongooseToObject(user)
    //   }))
    //   .catch(err => next(err));

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