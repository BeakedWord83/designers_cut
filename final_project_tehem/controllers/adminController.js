const adminModel = require("../models/admins");
const superAdminModel = require("../models/superAdmin");
const productModel = require("../models/products");
const clientModel = require("../models/clients");

const request = require("request");

// Super Admin auth section
exports.getSuperAdminLoginPage = (req, res) => {
  return res.render("admin/super-admin-login");
};

exports.postSuperAdminLoginPage = (req, res) => {
  if (req.session.isAdminLoggedIn) {
    delete req.session.isAdminLoggedIn;
  }

  // Action is LOGIN

  const username = req.body.username;
  const password = req.body.password;
  const admin = new superAdminModel(username, password);
  admin
    .superAdminLogin()
    .then((superAdmin) => {
      if (!superAdmin) {
        return res.redirect("/admin/super-admin-login");
      }
      req.session.isSuperAdminLoggedIn = true;
      req.session.superAdmin = superAdmin;
      req.session.save((err) => {
        console.log(err);
        return res.redirect("/admin/super-admin");
      });
    })
    .catch((err) => console.log(err));
};

// Super Admin dashboard section
exports.getSuperAdminDashboardPage = (req, res) => {
  return res.render("admin/super-admin-dashboard");
};

// ####################### Regular Admins Section ########################## //
exports.getAdminLoginPage = (req, res) => {
  return res.render("admin/admin-login");
};

exports.postAdminLoginPage = (req, res) => {
  if (req.session.isSuperAdminLoggedIn) {
    delete req.session.isSuperAdminLoggedIn;
  }

  // Action is LOGIN
  const username = req.body.username;
  const password = req.body.password;
  const admin = new adminModel(username, password);
  admin
    .adminLogin()
    .then((admin) => {
      if (!admin) {
        return res.redirect("/admin/admin-login");
      }
      req.session.isAdminLoggedIn = true;
      req.session.admin = admin;
      req.session.save((err) => {
        console.log(err);
        return res.redirect("/admin/admin");
      });
    })
    .catch((err) => console.log(err));
};

exports.getAdminDashboardPage = (req, res) => {
  return res.render("admin/admin-dashboard");
};

// Managing Section

exports.getManageProductsPage = (req, res) => {
  productModel
    .fetchAll()
    .then((products) => {
      res.render("admin/manage-products", {
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postManageProductsPage = (req, res) => {
  console.log(req.body);
  const action = req.body.action;
  const productId = req.body.productId;
  if (action === "delete") {
    productModel.fetchById(productId).then((product) => {
      const productDesigner = product.designer;
      const imageName = product.imageName;
      request.post(
        "http://localhost:8080/removeDesignFromInventory",
        { json: { designerId: productDesigner._id, designName: imageName } },
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("success!");
            console.log(body);
            res.redirect("/my-designs");
          }
        }
      );
      productModel
        .deleteById(productId)
        .then((result) => {
          res.redirect("/admin/manage-products");
        })
        .catch((err) => console.log(err));
    });
  } else if (action == "edit") {
    res.redirect("/admin/manage-products/edit-product/" + productId);
  }
};

exports.getEditProductPage = (req, res) => {
  const productId = req.params.productId;
  console.log(productId);
  productModel
    .fetchById(productId)
    .then((product) => {
      console.log(product);
      res.render("admin/manage-products-edit", {
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProductPage = (req, res) => {
  const productId = req.body.productId;
  const title = req.body.productTitle;
  const description = req.body.productDescription;
  const price = req.body.productPrice;
  const type = req.body.category;
  productModel
    .fetchById(productId)
    .then((product) => {
      product.title = title;
      product.description = description;
      product.price = price;
      product.type = type === "Select an Option" ? product.type : type;
      newProduct = new productModel(
        product.title,
        product.type,
        product.price,
        product.description,
        product.imageUrl,
        product.imageName,
        product._id,
        product.designer
      );
      newProduct.saveProduct();
    })
    .catch((error) => {
      console.error(error);
    });
  res.redirect("/admin/manage-products");
};

exports.getManageClientsPage = (req, res) => {
  clientModel
    .fetchAll()
    .then((clients) => {
      res.render("admin/manage-clients", {
        clients,
      });
    })
    .catch((err) => console.log(err));
};

exports.getManageAdminsPage = (req, res) => {
  adminModel
    .fetchAll()
    .then((admins) => {
      res.render("admin/manage-admins", {
        admins,
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddAdmin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const address = req.body.address;
  const admin = new adminModel(
    null,
    username,
    password,
    firstName,
    lastName,
    address
  );
  console.log(admin);
  admin
    .saveAdmin()
    .then((result) => {
      res.redirect("/admin/manage-admins");
    })
    .catch((err) => console.log(err));
};

exports.postManageAdminsPage = (req, res) => {
  const action = req.body.action;
  const adminId = req.body.adminId;
  if (action === "delete") {
    adminModel
      .deleteById(adminId)
      .then((result) => {
        res.redirect("/admin/manage-admins");
      })
      .catch((err) => console.log(err));
  } else if (action === "edit") {
    console.log("amogus " + adminId);
    res.redirect("/admin/manage-admins/edit-admin/" + adminId);
  }
};

exports.getEditAdminPage = (req, res) => {
  const adminId = req.params.adminId;
  console.log("hahaha " + adminId);
  adminModel
    .fetchById(adminId)
    .then((admin) => {
      res.render("admin/manage-admins-edit", {
        admin,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditAdminPage = (req, res) => {
  const adminId = req.body.adminId;
  const username = req.body.adminUsername;
  const password = req.body.adminPassword;
  const firstName = req.body.adminFirstName;
  const lastName = req.body.adminLastName;
  const address = req.body.adminAddress;
  console.log(adminId);

  const newAdmin = new adminModel(
    adminId,
    username,
    password,
    firstName,
    lastName,
    address
  );
  console.log(newAdmin);
  newAdmin
    .saveAdmin()
    .then((result) => {
      res.redirect("/admin/manage-admins");
    })
    .catch((err) => console.log(err));
};
