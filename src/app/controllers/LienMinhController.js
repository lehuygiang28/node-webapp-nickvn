const Category = require('../models/Category');
const LienMinh = require('../models/LienMinh');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');

class LienMinhController {

  // GET /lien-minh/acc-lien-minh
  showAccLienMinh(_req, res, next) {
    LienMinh.find({})
      .then(lienminhs => res.render('lien-minh/acc-lien-minh', {
        lienminhs: mutipleMongooseToObject(lienminhs)
      }))
      .catch(error => next(error));
  }

  // GET /lien-minh
  showLienMinhCategory(_req, res, next) {
    Category.findOne({ slug: _req.originalUrl.split('/').slice(1).join('/') })
      .then(category => res.render('lien-minh/lien-minh', {
        category: mongooseToObject(category)
      }))
      .catch(error => next(error));
  }

}

// export default new ;
module.exports = new LienMinhController;