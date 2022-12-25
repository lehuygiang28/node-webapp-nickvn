const User = require('../models/User');
const Category = require('../models/Category');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { createHash } = require('../../util/bcrypt');
const bcrypt = require('bcrypt');

class SiteController {

  // GET homepage
  home(_req, res, next) {

    Category.find({})
      .then(categories => res.render('sites/home', {
        categories: mutipleMongooseToObject(categories)
      }))
      .catch(next);

  }

  //GET /dang-xuat
  signout(_req, res, next) {
    if (_req.session.User) {
      _req.session.destroy(() => {
        console.log('Destroy session completed');
        return res.redirect('/?sout=' + 'True');
      });
    } else {
      return res.redirect('/?sout=' + 'False');
    }
  }

  // POST /dang-nhap
  loginSovle(_req, res, next) {
    // const passwordHash = createHash(_req.body.password);
    // console.log(_req.body.username + _req.body.password + passwordHash);

    // Find by username
    User.findOne({ userName: _req.body.username })
      .then(user => {
        if (!user) {
          console.log('User not found');
          res.status(401);
          return res.render('sites/dang-nhap', { error: 'Tài khoản hoặc mật khẩu không chính xác !' });
        }
        // Check password with hash function
        bcrypt.compare(_req.body.password, user.password, async function(err, result) {
          if (err) {
            return next(err);
          } else if (!result) {
            console.log('Dang nhap that bai: ' + result);
            res.status(401);
            return res.render('sites/dang-nhap', { error: 'Tài khoản hoặc mật khẩu không chính xác !' });
          }
          console.log('Dang nhap thanh cong: ' + result);
          // Set the session value
          _req.session.User = {
            userName: user.userName,
            money: user.money,
            role: user.role
          }

          // Update last login time
          user.lastLogin = Date.now();
          user = await user.save();
          
          console.log(_req.session.User);
          res.redirect('/');
        });
      })
      .catch(error => next(error));
  }

  // GET dang-nhap
  login(_req, res) {
    res.render('sites/dang-nhap');
  }

  signup(_req, res) {
    res.render('sites/dang-ky');
  }

}

// export default new DangNhapController;
module.exports = new SiteController;