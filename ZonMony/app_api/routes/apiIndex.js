var express = require('express');
var router = express.Router();

var apiCtrlExpense = require('../controllers/apiCtrlExpense');

 //GET
router.get('/', apiCtrlExpense.getFolder);
router.get('/folder', apiCtrlExpense.getFoldersByDTTM);

router.get('/:folderId', apiCtrlExpense.getFolderById); 

//Post
router.post('/', apiCtrlExpense.createFolder); 
router.post('/:folderId/payment', apiCtrlExpense.createPayment);

//Put
router.put('/:folderId', apiCtrlExpense.updateFolder); 
router.put('/:folderId/payment/:paymentId', apiCtrlExpense.updatePayment); 

//Delete
router.delete('/:folderId', apiCtrlExpense.deleteFolder); 
router.delete('/:folderId/payment/:paymentId', apiCtrlExpense.deletePayment); 


module.exports = router;

