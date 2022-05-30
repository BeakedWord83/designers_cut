// Import necessary modules
const route = require('color-convert/route');
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

router.get('/profile/:username', designerController.getProfilePage);
router.get('/profile-edit/:username', isDesignerAuth, designerController.getEditProfilePage);
router.post('/edit-profile/', isDesignerAuth, designerController.postEditProfilePage);
router.post('/change-profile-picture', isDesignerAuth, designerController.postChangeProfilePicture);

router.get('/add-product/:designName', isDesignerAuth, designerController.getAddProductPage);
router.post('/add-product', designerController.postAddProductPage);

router.get('/wallet', isDesignerAuth, designerController.getWalletPage);
// router.post('/add-product', designerController.postAddProductPage);

router.post('/choose-designs', isDesignerAuth, designerController.postChooseDesigns);

router.get('/remove-from-inventory/:designName', isDesignerAuth, designerController.removeFromInventory);
router.get('/remove-from-sale/:designName', isDesignerAuth, designerController.removeFromSale);

module.exports = router;