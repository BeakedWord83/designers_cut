const Client = require("../models/clients");
const Designer = require("../models/designers");
const fs = require("fs");



// Clients Authentication
exports.getLoginPage = (req, res) => {
  res.render("auth/client-auth");
};

exports.postRegister = (req, res) => {
  username = req.body.username.toLowerCase();
  email = req.body.email;
  companyName = req.body.companyName;
  password = req.body.password;
  id = null;
  console.log(username, email, companyName, password);

  const newClient = new Client(id, username, email, companyName, password, []);
  newClient
    .saveClient()
    .then((result) => {
      console.log("Client Successfully Registered!");
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogin = (req, res, next) => {
  email = req.body.email;
  password = req.body.password;
  Client.login(email, password)
    .then((user) => {
      if (!user) {
        console.log("Client not found");
        return res.redirect("/login");
      }
      req.session.isClientLoggedIn = true;
      req.session.client = user;
      req.session.save((err) => {
        console.log(err);
        return res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    
  });
  res.redirect("/");
};

// Designer Authentication
exports.getDesignerLoginPage = (req, res) => {
  res.render("auth/designer-auth");
};

exports.postDesignerLogin = (req, res, next) => {
  const username = String(req.body.username).toLowerCase();
  const password = req.body.password;

  console.log("here!")
  Designer.login(username, password)
    .then((designer) => {
      if (!designer) {
        console.log("Designer not found");
        return res.redirect("/designer-login");
      }
      console.log(designer);
      req.session.isDesignerLoggedIn = true;
      req.session.designer = designer;
      req.session.save((err) => {
        console.log(err);
        return res.redirect("/designer-dashboard");
      });
    })
    .catch((err) => console.log(err));
};

exports.postDesignerRegister = (req, res) => {
  // Getting the client's data for register
  const username = String(req.body.username).toLowerCase();
  const password = req.body.password;
  const description = req.body.description;
  let image = req.file;
  console.log(image);
  Designer.fetchByUsername(username)
    .then((designer) => {
      // Checking if the designer is already registered
      if (designer) {
        
        console.log("Designer already exists");
        return res.redirect("/designer-login");
      }
      // Preprocessing the user's profile picture and adding it to the file system
      const system_path =
        "C:\\Users\\user\\Desktop\\folders\\web_project_tehem\\final_project_tehem\\public\\images\\";
      const filename = username + "profilepicture.png";

      let imagePath = system_path + filename;

      image = fs.readFileSync(image.path);

      console.log(image);
       fs.writeFileSync(imagePath, Buffer.from(image), (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
      });

      imagePath = "\\public\\images\\" + filename;
      // Creating the new designer
      const id = null;
      console.log(username, password, description, image);
      const newClient = new Designer(
        id,
        username,
        password,
        description,
        imagePath
      );
      return newClient
        .saveDesigner()
        .then((result) => {
          console.log("Designer Successfully Registered!");
          res.redirect("/designer-login");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
};
