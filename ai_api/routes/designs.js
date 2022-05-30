const express = require('express');

const designsController = require('../controllers/designs');

const router = express.Router();

router.post('/designs', designsController.getDesignsInventory);
router.post('/useAI', designsController.postUseAI);

router.post('/insertIntoInventory', designsController.postInsertIntoInventory);

router.post('/getSpecificDesign', designsController.getSpecificDesign);
router.post('/deleteInventory', designsController.deleteInventory);

router.post('/remove-from-inventory', designsController.removeFromInventory);
module.exports = router;


