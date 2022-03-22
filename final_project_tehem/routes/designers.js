// Import necessary modules
const express = require('express');
const router = express.Router();

// Import Controller
const designerController = require('../controllers/designerController');

const isDesignerAuth = require('../middleware/is-auth').designerIsLoggedIn;


// Designers Page Routing
router.get('/design', isDesignerAuth, designerController.getDesignPage);

router.get('/designer-dashboard', isDesignerAuth, designerController.getDesignerDashboardPage);

router.post('/design', isDesignerAuth, designerController.postDesignPage);

router.get('/my-designs', isDesignerAuth, designerController.getMyDesignsPage);

router.get('/profile/:username', designerController.getProfilePage)
router.get('/add-product/:designName', designerController.getAddProductPage);
router.post('/add-product', designerController.postAddProductPage);
// router.post('/add-product', designerController.postAddProductPage);

router.post('/choose-designs', isDesignerAuth, designerController.postChooseDesigns);


module.exports = router;