const express = require('express');
const auth = require('../../middelwares/auth');
const whatsappController = require('./whatsapp')

const router = express.Router();

router.post('/add', auth, whatsappController.addMessage); 
router.get('/', auth, whatsappController.getAllMessages); 
router.get('/view/:id', auth, whatsappController.getMessageById); 
router.delete('/delete/:id', auth, whatsappController.deleteMessage); 
router.post('/deleteMany', auth, whatsappController.deleteManyMessages); 

module.exports = router;

