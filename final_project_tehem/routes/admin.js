const express = require("express");
const router = express.Router();

const isAdminLoggedIn = require("../middleware/is-auth").adminIsLoggedIn;
const isSuperAdminLoggedIn = require("../middleware/is-auth").superAdminIsLoggedIn;
const adminController = require("../controllers/adminController");

router.post("/admin-login", adminController.postAdminLoginPage);

router.get(
  "/super-admin",
  isAdminLoggedIn,
  adminController.getSuperAdminDashboardPage
);

router.get("/admin-login", adminController.getAdminLoginPage);
router.get("/admin", isAdminLoggedIn, adminController.getAdminDashboardPage);

router.get(
  "/manage-products",
  isAdminLoggedIn,
  adminController.getManageProductsPage
);
router.post(
  "/manage-products",
  isAdminLoggedIn,
  adminController.postManageProductsPage
);
router.get(
  "/manage-products/edit-product/:productId",
  isAdminLoggedIn,
  adminController.getEditProductPage
);
router.post(
  "/manage-products/edit-product",
  isAdminLoggedIn,
  adminController.postEditProductPage
);

router.get(
  "/manage-clients",
  isAdminLoggedIn,
  adminController.getManageClientsPage
);

router.post(
  "/manage-clients",
  isAdminLoggedIn,
  adminController.postManageClientsPage
)

router.get(
  "/manage-clients/edit-client/:clientId",
  isAdminLoggedIn,
  adminController.getEditClientPage
);

router.post(
  "/manage-clients/edit-client",
  isAdminLoggedIn,
  adminController.postEditClientPage
);

router.get(
  "/manage-designers",
  isAdminLoggedIn,
  adminController.getManageDesignersPage
);
router.post(
  "/manage-designers",
  isAdminLoggedIn,
  adminController.postManageDesignersPage
);
router.get(
  "/manage-designers/edit-designer/:designerId",
  isAdminLoggedIn,
  adminController.getEditDesignerPage
);
router.post(
  "/manage-designers/edit-designer",
  isAdminLoggedIn,
  adminController.postEditDesignerPage
);


router.get(
  "/manage-admins",
  isSuperAdminLoggedIn,
  adminController.getManageAdminsPage
);

router.post('/manage-admins/add-admin', isSuperAdminLoggedIn, adminController.postAddAdmin);
router.post('/manage-admins', isSuperAdminLoggedIn, adminController.postManageAdminsPage);
router.get('/manage-admins/edit-admin/:adminId', isSuperAdminLoggedIn, adminController.getEditAdminPage);
router.post('/manage-admins/edit-admin', isSuperAdminLoggedIn, adminController.postEditAdminPage);
module.exports = router;
