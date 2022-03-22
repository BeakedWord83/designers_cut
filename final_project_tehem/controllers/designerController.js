const Designer = require("../models/designers");
const Product = require("../models/products");
const request = require("request");
const fs = require("fs");

exports.getBecomeDesignerPage = (req, res, next) => {
  res.render("becomeDesigner");
};

exports.postBecomeDesignerPage = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const description = req.body.description;
  const image = req.body.image;
  const yearsOfExperience = req.body.yearsOfExperience;
};

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
    "http://localhost:8080/useAI",
    { json: { image: binaryData } },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("testing", body);
        const design = body.data;
        const system_path =
          "C:\\Users\\user\\Desktop\\folders\\web_project_tehem\\final_project_tehem\\public\\images\\";
        const filename =
          Date.now() +
          Math.floor(Math.random() * 10) +
          "-" +
          design.originalname;
        let path = system_path + filename;
        fs.writeFileSync(path, Buffer.from(design.body), (err) => {
          if (err) throw err;
          console.log("The file has been saved!");
        });
        path = {
          imagePath: "images\\" + filename,
          originalname: design.originalname,
        };

        req.session.path = path;

        res.render("temporary-designs", {
          design: path.imagePath,
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
  image = fs.readFileSync("public\\" + options.design);
  fs.unlinkSync("public\\" + options.design);

  let imagePath = `public\\images\\stored\\stored-${Math.random() * 0.1}.png`;
  fs.writeFileSync(imagePath, image, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });

  request.post(
    "http://localhost:8080/insertIntoInventory",
    {
      json: { imagePath, designer_id: req.designer._id},
    },
    function (error, response, body) {
      if (!error && response.statusCode == 201) {
        let path = req.session.path;

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

  return request.post(
    "http://localhost:8080/designs",
    { json: { userId: req.designer._id } },
    function (error, response, body) {
      const paths = [];
      if (!error && response.statusCode == 200) {
        console.log(body);

        body.inventory.designs.forEach((design) => {
          paths.push({
            imagePath: design.imagePath,
            imageName: design.imageName,
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
  if (!req.session.designer) {
    return res.redirect("designer-login");
  }
  console.log(req.params);
  const designName = req.params.designName;
  request.post(
    "http://localhost:8080/getSpecificDesign",
    { json: { designerId: req.designer._id, designName } },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("success!");
        console.log(body);
        const designName = body.design.imageName.replace(".png", "");
        console.log(designName);
        const design = {designUrl: "\\"+body.design.imagePath, designName: designName}
        console.log(design);
        return res.render("designer/add-product", {
          design
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
  const category = req.body.category;
  const designerId = req.designer._id;
  const product = new Product(title, type.toLowerCase(), price, description, imageUrl, null, designerId);
  product.saveProduct();

  res.redirect('/');



};

exports.getProfilePage = (req, res) => {
  const designerUsername = req.params.designerUsername;
  return Designer.fetchByUsername(designerUsername)
    .then((designer) => {
      return res.render("designer/profile", { designer });
    })
    .catch((err) => {
      console.log(err);
    });
};
