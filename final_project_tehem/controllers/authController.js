const Client = require("../models/clients");
const Designer = require("../models/designers");
const fs = require("fs");
const path = require("path");

// Clients Authentication
exports.getLoginPage = (req, res) => {
  const errorMessage = req.flash("error");
  const successMessage = req.flash("success");
  res.render("auth/client-auth", {
    errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
    successMessage: successMessage.length > 0 ? successMessage[0] : null,
  });
};

exports.postRegister = (req, res) => {
  username = req.body.username.toLowerCase();
  email = req.body.email;
  companyName = req.body.companyName;
  password = req.body.password;
  id = null;
  console.log(username, email, companyName, password);
  Client.findByEmail(email)
    .then((client) => {
      if (client) {
        req.flash("error", "Email already exists");
        res.redirect("/login");
      } else {
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
      }

 
})
.catch((err) => console.log(err));
};

exports.postLogin = (req, res, next) => {
  if (req.session.isDesignerLoggedIn) {
    delete req.session.designer;
    delete req.session.isDesignerLoggedIn;
  }

  email = req.body.email;
  password = req.body.password;
  Client.login(email, password)
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      req.session.isClientLoggedIn = true;
      req.session.client = user;
      req.session.save((err) => {
        console.log(err);
        req.flash("success", "You have been logged in successfully!");
        return res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.getLogout = (req, res) => {
  req.flash("success", "You have logged out successfully.");
  req.session.destroy((err) => {
    console.log(err);
  });
  return res.redirect("/");
};

// Designer Authentication
exports.getDesignerLoginPage = (req, res) => {
  const message = req.flash("error");
  const successMessage = req.flash("success");
  res.render("auth/designer-auth", {
    errorMessage: message.length > 0 ? message[0] : null,
    successMessage: successMessage.length > 0 ? successMessage[0] : null,
  });
};

exports.postDesignerLogin = (req, res, next) => {
  if (req.session.isClientLoggedIn) {
    delete req.session.client;
    delete req.session.isClientLoggedIn;
  }

  const username = String(req.body.username).toLowerCase();
  const password = req.body.password;

  console.log("here!");
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

  Designer.fetchByUsername(username)
    .then((designer) => {
      // Checking if the designer is already registered
      if (designer) {
        console.log("Designer already exists");
        req.flash("error", "username already exists");
        return res.redirect("/designer-login");
      }
      // Preprocessing the user's profile picture and adding it to the file system
      let imagePath = "/images/default.jpg"; // default
      let image = req.file;

      if (image) {
        const system_path = path.join(
          __dirname,
          "../public/images/profile-pictures/"
        );
        const filename = username + "-profilepicture.png";

        imagePath = system_path + filename;

        image = fs.readFileSync(image.path);

        console.log(image);
        fs.writeFileSync(imagePath, Buffer.from(image), (err) => {
          if (err) throw err;
          console.log("The file has been saved!");
        });

        imagePath = "/images/profile-pictures/" + filename;
      }
      // Creating the new designer
      const id = null;
      console.log(username, password, description, image);
      const newDesigner = new Designer(
        id,
        username,
        password,
        description,
        imagePath,
        0
      );
      return newDesigner
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
