const Designer = require("../models/designers");
const Product = require("../models/products");
const request = require("request");
const fs = require("fs");
const path = require("path");

// const apiUrl = "https://designers-cut-api.herokuapp.com"
const apiUrl = "http://localhost:8080";

exports.getDesignerDashboardPage = (req, res) => {
  res.render("designer/designer-dashboard", {
    path: "/about",
    username: req.designer.username,
  });
};

exports.getDesignPage = (req, res) => {
  if (!req.session.designer) {
    return res.redirect("/designer-login");
  }
  return res.render("designer/design", {
    path: "/create-design",
    username: req.designer.username,
  });
};

exports.postDesignPage = (req, res) => {
  binaryData = fs.readFileSync(req.file.path);

  request.post(
    `${apiUrl}/useAI`,
    { json: { image: binaryData } },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("testing", body);
        const design = body.data;
        const system_path = path.join(__dirname, "..", "/public/images/");
        const filename =
          Date.now() +
          Math.floor(Math.random() * 10) +
          "-" +
          design.originalname;
        let pathFile = system_path + filename;
        fs.writeFileSync(pathFile, Buffer.from(design.body), (err) => {
          if (err) throw err;
          console.log("The file has been saved!");
        });
        pathFile = {
          imagePath: "images/" + filename,
          originalname: design.originalname,
        };

        req.session.path = pathFile;

        res.render("temporary-designs", {
          design: pathFile.imagePath,
        });
      }
    }
  );
};

exports.postChooseDesigns = (req, res) => {
  console.log(
    "WE'RE HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );

  console.log(req.body);
  const options = { ...req.body };
  image = fs.readFileSync("public/" + options.design);
  fs.unlinkSync("public/" + options.design);

  let imagePath = `public/images/stored/stored-${Math.random() * 0.1}.png`;
  fs.writeFileSync(imagePath, image, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });

  request.post(
    `${apiUrl}/insertIntoInventory`,
    {
      json: { imagePath, designer_id: req.designer._id },
    },
    function (error, response, body) {
      if (!error && response.statusCode == 201) {
        // let path = req.session.path;

        req.session.allPaths = null;
        res.redirect("/my-designs");
      }
    }
  );
};

exports.getMyDesignsPage = (req, res) => {
  if (!req.session.designer) {
    return res.redirect("/designer-login");
  }
  const dir = path.join(__dirname, "..", "public", "images", "stored");
  const files = fs.readdirSync(dir);
  console.log(files);
  return request.post(
    `${apiUrl}/designs`,
    { json: { userId: req.designer._id } },
    function (error, response, body) {
      const paths = [];
      if (!error && response.statusCode == 200) {
        console.log(body);

        body.inventory.designs.forEach((design) => {
          const exists = files.includes(
            design.imagePath
              .replace("images/stored/", "")
              .replace(".png", "-product.png")
          );
          console.log(exists);
          paths.push({
            imagePath: exists
              ? design.imagePath.replace(".png", "-product.png")
              : design.imagePath,
            imageName: design.imageName,
            exists,
          });
        });
      }
      res.render("designer/my-designs", {
        designs: paths,
        path: "/my-designs",
        username: req.designer.username,
      });
    }
  );
};

exports.getAddProductPage = (req, res) => {
  const designName = req.params.designName;

  request.post(
    `${apiUrl}/getSpecificDesign`,
    { json: { designerId: req.designer._id, designName } },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("success!");
        console.log(body);
        const designName = body.design.imageName.replace(".png", "");
        console.log(designName);
        const design = {
          designUrl: "/" + body.design.imagePath,
          designName: designName,
        };
        console.log(design);
        return res.render("designer/add-product", {
          design,
        });
      }
    }
  );
};

exports.postAddProductPage = (req, res) => {
  const title = req.body.productName;
  const type = req.body.category;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const imageName = req.body.imageName;
  const newImageUrl = req.body.imageUrl.replace(".png", "-product.png");
  console.log(imageUrl);

  const designer = {
    _id: req.designer._id,
    username: req.designer.username,
    profilePicture: req.designer.imageUrl,
  };
  const product = new Product(
    title,
    type.toLowerCase(),
    price,
    description,
    newImageUrl,
    imageName,
    null,
    designer
  );

  const oldPath = path.join(__dirname, "..", "public", imageUrl);
  const newPath = path.join(__dirname, "..", "public", newImageUrl);
  fs.rename(oldPath, newPath, () => {
    product.saveProduct();
    res.redirect("/my-designs");
  });
};

exports.getProfilePage = (req, res) => {
  const designerUsername = req.params.username;
  console.log(designerUsername);
  const successMessage = req.flash("success");

  return Designer.fetchByUsername(designerUsername)
    .then((designer) => {
      console.log(designer);
      let isProfileDesigner = false;
      if (req.designer) {
        isProfileDesigner =
          req.designer._id.toString() == designer._id.toString();
      }
      console.log("IS PROFILE DESIGNER??: " + isProfileDesigner);
      Product.fetchByDesigner(designer._id).then((products) => {
        return res.render("designer/profile", {
          designer,
          designs: products,
          isProfileDesigner,
          successMessage: successMessage.length > 0 ? successMessage[0] : null,
        });
      });
    })

    .catch((err) => {
      console.log("hahaha" + err);
    });
};

exports.getEditProfilePage = (req, res) => {
  const designerUsername = req.params.username;
  const errorMessage = req.flash("error");

  Designer.fetchByUsername(designerUsername).then((designer) => {
    return res.render("designer/edit-profile", {
      designer,
      errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
    });
  });
};

exports.postEditProfilePage = (req, res) => {
  const designerUsername = req.designer.username;
  console.log(designerUsername);
  console.log(req.body);

  const newUsername = req.body.username;
  const newPassword = req.body.password;
  const newDescription = req.body.description;

  Designer.fetchByUsername(newUsername)
    .then((designer) => {
      if (designer && designer.username != req.designer.username) {
        req.flash("error", "Username already taken");
        return res.redirect("/profile-edit/" + designerUsername);
      } else {
        const designer = req.designer;
        designer.username = newUsername;
        designer.password = newPassword;
        designer.description = newDescription;
        designer
          .saveDesigner()
          .then((result) => {
            Product.fetchAll().then((products) => {
              products.forEach((product) => {
                if (product.designer._id.toString() == designer._id.toString()) {
                  product.designer.username = newUsername;
                product.saveProduct();
                }
              });
              
                req.flash("success", "Profile updated successfully");
            return res.redirect("/designer-login");
            });
              
            
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postChangeProfilePicture = (req, res) => {
  console.log("actually here");
  let image = req.file;
console.log(image);
  
    const system_path = path.join(
      __dirname,
      "../public/images/profile-pictures/"
    );
    const filename = req.designer.username + "-profilepicture.png";

    let imagePath = system_path + filename;

    image = fs.readFileSync(image.path);

    console.log(image);
    fs.writeFileSync(imagePath, Buffer.from(image), (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
      
    });

    imagePath = "/images/profile-pictures/" + filename;
    const designer = req.designer;
    designer.imageUrl = imagePath;
    designer.saveDesigner().then((result) => {
      Product.fetchAll().then((products) => {
        products.forEach((product) => {
          if (product.designer._id.toString() == designer._id.toString()) {
            product.designer.imageUrl = imagePath;
            product.saveProduct();
          }
        });
      req.flash("success", "Profile Picture Changed Successfully!");
      return res.redirect("/profile/" + designer.username);

    });
    });

  
};

exports.getWalletPage = (req, res) => {
  console.log(req.designer);
  const money = req.designer.wallet;

  res.render("designer/wallet", {
    money: `$${money.toFixed(2)}`,
    path: "/wallet",
    username: req.designer.username,
  });
};

exports.removeDesignFromInventory = (req, res) => {
  const designName = req.params.designName;
  console.log(designName);
  request.post(
    `${apiUrl}/removeDesignFromInventory`,
    { json: { designerId: req.designer._id, designName } },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("success!");
        console.log(body);
        res.redirect("/my-designs");
      }
    }
  );
};

exports.removeFromInventory = (req, res) => {
  const designName = req.params.designName;
  console.log(designName);
  request.post(
    `${apiUrl}/remove-from-inventory`,
    { json: { designerId: req.designer._id, designName } },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("success!");
        console.log(body);
        res.redirect("/my-designs");
      }
    }
  );
};

exports.removeFromSale = (req, res) => {
  console.log("here");
  const imagePath = path.join(__dirname, "..", "public", "images", "stored/");
  const designName = req.params.designName;
  const productDesignName = designName + "-product.png";
  console.log(imagePath + productDesignName);
  if (fs.existsSync(imagePath + productDesignName)) {
    Product.deleteByImageName(designName);
    fs.rename(
      imagePath + productDesignName,
      imagePath + designName + ".png",
      () => {
        res.redirect("/my-designs");
      }
    );
  } else {
    console.log("no such file");
    res.redirect("/my-designs");
  }
};
