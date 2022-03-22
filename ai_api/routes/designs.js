const express = require('express');

const designsController = require('../controllers/designs');

const router = express.Router();

router.post('/designs', designsController.getDesignsInventory);
router.post('/useAI', designsController.postUseAI);

router.post('/insertIntoInventory', designsController.postInsertIntoInventory);

router.post('/getSpecificDesign', designsController.getSpecificDesign);
module.exports = router;


