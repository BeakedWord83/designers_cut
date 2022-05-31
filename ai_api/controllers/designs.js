const Inventory = require("../models/inventories");
const Design = require("../models/designs");
const fs = require("fs");
const request = require("request");
const querystring = require("querystring");
const path = require("path");

exports.getDesignsInventory = (req, res, next) => {
  const userId = req.body.userId;
  console.log(userId);
  Inventory.fetchInventory(userId).then((inventory) => {
    console.log(inventory);
    if (inventory)
      res.status(200).json({
        message: "Fetched inventory successfully!",
        inventory: inventory,
      });
    else
      res.status(400).json({
        message: "no inventory!",
      });
  });
};

exports.postUseAI = (req, res, next) => {
  let binary = Buffer.from(req.body.image.data);
  console.log(req.body.image);
  let filePath = path.join(__dirname, "..", "images/temp/temp-"+(Math.random()*0.1).toString()+".png");
  fs.writeFileSync(filePath, binary, (err) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  binary = fs.createReadStream(filePath);

  var form = {
    file: binary,
  };

  // console.log(formData);
  request.post(
    {
      headers: {
        "Content-Type": "multipart/form-data",
        connection: "keep-alive",
      },
      // url: "https://tomer.maximilianvh.com/predict",
      url: "http://localhost:8000/predict",
      method: "POST",
      formData: form,
    },
    function (error, response, body) {
      if (!error) {
        console.log(body);
        console.log(Buffer.from(body));
        var filePath = path.join(__dirname, "..", "images/predictions/predicted-"+(Math.random()*0.1).toString()+".png");
          
        body = Buffer.from(body, "base64");
        fs.writeFileSync(filePath, body, (err) => {
          if (err) {
            console.log(err);
          }
          console.log("The file has been saved!");
        });
        res.status(200).json({
          message: "AI prediction successful!",
          data: {
            body,
            originalname: "prediction" + Math.random() * 10 + ".png",
          },
        });
      } else {
        console.log(error);
        res.status(500).json({
          message: "AI prediction failed!",
        });
      }
    }
  );
};

exports.postInsertIntoInventory = (req, res, next) => {
  console.log("WE'RE HERE LOL!");
  console.log(req.body);
  const userId = req.body.designer_id;
  const imagePath = req.body.imagePath.replace("public/", "");
  let imageName = imagePath.replace("images/stored/", "");
  imageName = imageName.replace(".png", "");
  let design = new Design(imagePath, imageName);

  Inventory.fetchInventory(userId).then((inventory) => {
    console.log(inventory);
    inventory
      ? Inventory.addToDesigns(design, inventory, userId)
      : new Inventory(userId, design).save();
  });

  res.status(201).json({
    message: "Inserted into inventory successfully!",
  });
};

exports.getSpecificDesign = (req, res) => {
  const designer = req.body.designerId;
  const designName = req.body.designName;

  Inventory.fetchInventory(designer).then((inventory) => {
    const design = inventory.designs.find(
      (element) => element.imageName == designName
    );
    console.log(design);
    if (design)
      res.status(200).json({
        message: "Fetched specific design successfully!",
        design: design,
      });
    else
      res.status(401).json({
        message: "Failed to fetch specific design!",
      });
  });
};

exports.removeFromInventory = (req, res) => {
  const designer = req.body.designerId;
  const designName = req.body.designName;

  Inventory.fetchInventory(designer)
    .then((inventory) => {
      const newInventory = inventory.designs.filter(
        (element) => element.imageName != designName
      );
      inventory.designs = newInventory;
      Inventory.updateInventory(inventory, designer);
      res.status(200).json({
        message: "Removed from sale successfully!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Failed to remove from sale!",
      });
    });
};


exports.deleteInventory = (req, res) => {
  const designerId = req.body.designerId;
  Inventory.deleteInventoryById(designerId).then((inventory) => {
    res.status(200).json({
      message: "Deleted inventory successfully!",
    });

  });
}