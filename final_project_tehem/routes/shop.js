// Import necessary modules
const express = require('express');
const router = express.Router();

// Import middleware
const isAuth = require('../middleware/is-auth').clientIsLoggedIn;

// Import controller
const shopController = require('../controllers/shopController');


// Main Page Routing
router.get('/', shopController.getIndexPage);
router.get(['/category/:type', '/category'], shopController.getCategoryPage);

router.get('/cart', isAuth, shopController.getCartPage);
router.post('/add-to-cart', shopController.postAddToCart);
router.post('/remove-from-cart', shopController.postRemoveFromCart);

// Sub-Categories for Products
// router.get('/manandwoman')
// router.get('/shoes')
// router.get('/accessories')

router.get('/checkout', isAuth, shopController.getCheckoutPage);
router.post('/checkout', shopController.postCheckout);
router.get('/success', isAuth, shopController.getSuccessPage);
router.get('/cancel', isAuth, shopController.getCancelPage);



module.exports = router;