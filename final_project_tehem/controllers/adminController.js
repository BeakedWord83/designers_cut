const adminModel = require("../models/admins");
const superAdminModel = require("../models/superAdmin");
const productModel = require("../models/products");
const clientModel = require("../models/clients");
const designerModel = require("../models/designers");

// const apiUrl = "https://designers-cut-api.herokuapp.com";
const apiUrl = "http://localhost:8080";

const request = require("request");

// Super Admin dashboard section
exports.getSuperAdminDashboardPage = (req, res) => {
  return res.render("admin/super-admin-dashboard");
};

// ####################### Regular Admins Section ########################## //

exports.getAdminLoginPage = (req, res) => {
  if (req.session.admin) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  return res.render("admin/admin-login");
};

exports.postAdminLoginPage = (req, res) => {
  if (req.session.isAdminLoggedIn) {
    delete req.session.isAdminLoggedIn;
  }

  // Action is LOGIN
  const username = req.body.username;
  const password = req.body.password;
  const admin = new adminModel(null, username, password);
  admin
    .loginAdmin()
    .then((admin) => {
      if (!admin) {
        return res.redirect("/admin/admin-login");
      }
      if (admin.isSuperAdmin) {
        req.session.isSuperAdminLoggedIn = true;
      }
      req.session.isAdminLoggedIn = true;
      req.session.admin = admin;
      req.session.save((err) => {
        console.log(err);
        if (admin.isSuperAdmin) {
          return res.redirect("/admin/super-admin");
        }
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
        `${apiUrl}/removeDesignFromInventory`,
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

exports.postManageClientsPage = (req, res) => {
  const action = req.body.action;
  const clientId = req.body.clientId;
  if (action === "delete") {
    clientModel
      .deleteById(clientId)
      .then((result) => {
        res.redirect("/admin/manage-clients");
      })
      .catch((err) => console.log(err));
  } else if (action === "edit") {
    res.redirect("/admin/manage-clients/edit-client/" + clientId);
  }
};

exports.getEditClientPage = (req, res) => {
  const clientId = req.params.clientId;
  clientModel
    .findById(clientId)
    .then((client) => {
      console.log(client);
      res.render("admin/manage-clients-edit", {
        r_client: client,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditClientPage = (req, res) => {
  const clientId = req.body.clientId;
  const username = req.body.clientUsername;
  const email = req.body.clientEmail;
  const password = req.body.clientPassword;
  const companyName = req.body.clientCompanyName;
  clientModel
    .findById(clientId)
    .then((client) => {
      client.username = username;
      client.email = email;
      client.password = password;
      client.companyName = companyName;
      newClient = new clientModel(
        client._id,
        client.username,
        client.email,
        client.companyName,
        client.password,
        client.cart
      );
      newClient.saveClient();
    })
    .catch((error) => {
      console.error(error);
    });
  res.redirect("/admin/manage-clients");
};

exports.getManageDesignersPage = (req, res) => {
  designerModel
    .fetchAll()
    .then((designers) => {
      res.render("admin/manage-designers", {
        designers,
      });
    })
    .catch((err) => console.log(err));
};

exports.postManageDesignersPage = (req, res) => {
  const action = req.body.action;
  const designerId = req.body.designerId;
  if (action === "delete") {
    designerModel
      .deleteById(designerId)
      .then((result) => {
        productModel.deleteByDesignerId(designerId);
        request.post(
          `${apiUrl}/deleteInventory`,
          { json: { designerId: designerId } },
          function (error, response, body) {
            if (!error && response.statusCode == 200) {
              console.log("success!");
              console.log(body);
              return res.redirect("/admin/manage-designers");
            }
          }
        );
      })
      .catch((err) => console.log(err));
  } else if (action === "edit") {
    res.redirect("/admin/manage-designers/edit-designer/" + designerId);
  }
};

exports.getEditDesignerPage = (req, res) => {
  const designerId = req.params.designerId;
  designerModel
    .fetchById(designerId)
    .then((designer) => {
      console.log(designer);
      res.render("admin/manage-designers-edit", {
        designer,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditDesignerPage = (req, res) => {
  const designerId = req.body.designerId;
  const username = req.body.designerUsername;
  const password = req.body.designerPassword;
  const description = req.body.designerDescription;

  designerModel
    .fetchById(designerId)
    .then((designer) => {
      designer.username = username;
      designer.password = password;
      designer.description = description;
      newDesigner = new designerModel(
        designer._id,
        designer.username,
        designer.password,
        designer.description,
        designer.imageUrl,
        designer.wallet
      );
      newDesigner.saveDesigner();
    })
    .catch((error) => {
      console.error(error);
    });
  res.redirect("/admin/manage-designers");
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
  console.log("EDIT MODE");

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
