// Import express and setup app
const express = require("express");
const mongoConnect = require("./utils/database").mongoConnect;
const session = require("express-session");
const flash = require("connect-flash");
const MongoDBStore = require("connect-mongodb-session")(session);
const shopRoutes = require("./routes/shop");
const designersRoutes = require("./routes/designers");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const multer = require("multer");
const Client = require("./models/clients");
const Designer = require("./models/designers");

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
// Configure the middleware to use (view engine and views folder)
app.set("view engine", "ejs");
app.set("views", "views");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + Math.random() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed_mimetypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/jfif",
  ];
  allowed_mimetypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};
// Configure the middleware to use
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.client) {
    return next();
  }
  Client.findById(req.session.client._id)
    .then((client) => {
      if (client){
        console.log("YES");
        console.log(req.session.isClientLoggedIn);
        req.client = new Client(
          client._id,
          client.username,
          client.email,
          client.companyName,
          client.password,
          client.cart
        );}
      else req.client = null;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  if (!req.session.designer) {
    return next();
  }
  Designer.fetchByUsername(req.session.designer.username)
    .then((designer) => {
      if (designer)
      req.designer = new Designer(
        designer._id,
        designer.username,
        designer.password,
        designer.description,
        designer.imageUrl,
        designer.wallet
      );
      else req.designer = null;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isClientLoggedIn = req.session.isClientLoggedIn;
  res.locals.isDesignerLoggedIn = req.session.isDesignerLoggedIn;
  res.locals.isAdminLoggedIn = req.session.isAdminLoggedIn;
  res.locals.isSuperAdminLoggedIn = req.session.isSuperAdminLoggedIn;
  next();
});


app.use(flash());

// Configure the routes to use
app.use(shopRoutes);
app.use(designersRoutes);
app.use(authRoutes);
app.use('/admin', adminRoutes);
// Configure database and start the server on port 3000
mongoConnect(() => {
  app.listen(process.env.PORT || 3000);
});
