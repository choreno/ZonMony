var express = require('express');
var router = express.Router();

var ctrlHome = require('../controllers/ctrlHome'); 
var ctrlAbout = require('../controllers/ctrlAbout'); 

var ctrlAngularSPA = require('../controllers/ctrlAngularSPA'); 

/* GET home page. */
router.get('/', ctrlAngularSPA.angularSPA); //Angular - SPA, only this is required for initial page view !!!

router.get('/folder/:folderId', ctrlHome.folderInfo); 

router.get('/about', ctrlAbout.about);


module.exports = router;

