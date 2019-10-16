var express = require('express');
var router = express.Router();
require('../utils/helpers')();

router.get('/',function(req,res,next){
   res.render('search.html');
});

module.exports = router;