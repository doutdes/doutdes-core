const facebookManager = require('../engine/facebook-manager');

exports.fbFanCount = function (req,res,next) {
  facebookManager.fbFanCount()
      .then(result => {
          res.json(result);
      })
      .catch(err =>{
          res.json(err);
      });
};