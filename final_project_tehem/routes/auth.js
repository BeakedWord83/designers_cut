// Import necessary modules
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
// Client Auth Page Routing
router.get('/login', authController.getLoginPage);
router.post('/client-register', authController.postRegister);
router.post('/login', authController.postLogin);

// Designer Auth Page Routing
router.get('/designer-login', authController.getDesignerLoginPage);
router.post('/designer-register', authController.postDesignerRegister);
router.post('/designer-login', authController.postDesignerLogin);

router.get('/logout', authController.getLogout); 
module.exports = router;