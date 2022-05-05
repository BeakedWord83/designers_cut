// Module Imports

const Client = require("../models/clients");
const Product = require("../models/products");
const Designer = require("../models/designers");
const stripe = require("stripe")(
  "sk_test_51KP3UzLEudQkZUXXnuWsJ7UnYsJvqVD9me6AJjfrnnpOwTpqRkGq0sQxnTy47F0fAB0tjpDbnIQhSTokPQxpJk6o00AtIOO8Vx"
);

// <-------------------- Main page -------------------->
exports.getIndexPage = (req, res) => {
  const message = req.flash("success");
  res.render("shop/index", {
    successMessage: message.length > 0 ? message[0] : null,
  });
};

// <----------------------- Login page -------------------->

// Individual Item page
exports.getItemPage = (req, res, next) => {
  itemId = req.params.itemId;
  Product.fetchById(itemId)
    .then((product) => {
      if (!product) {
        res.redirect('/');
      }
  res.render("shop/item", {
    product,
    path: `item/${itemId}`,
  });
});
};
exports.PostItemPage = (req, res) => {
  itemId = req.params.itemId;
};

// <----------------------- Category page -------------------->
exports.getCategoryPage = (req, res) => {
  const type = req.params.type;
  console.log("Here! type is ", type);
  const categories = ["vans", "sport", "elegant"];
  Product.fetchAll()
    .then((products) => {
      const filtered =
        type && categories.includes(type.toLowerCase())
          ? products.filter((product) => product.type === type)
          : products;
      
      console.log("haha!", filtered);
      return res.render("shop/category", { products: filtered });
    })
    .catch((err) => console.error("error"));
};

exports.getCartPage = (req, res, next) => {
  const cart = req.client.cart;
  console.log(cart);
  const reducer = (accumulator, curr) => accumulator + curr;
  const totalPrice = cart
    .map((product) => parseInt(product.price))
    .reduce(reducer, 0);
  res.render("shop/cart", {
    products: cart,
    user: req.client,
    totalPrice,
    count: cart.length,
  });
};

exports.postAddToCart = (req, res, next) => {
  const productId = req.body.productId;
  console.log(productId);
  Product.fetchById(productId)
    .then((product) => {
      console.log(product);
      console.log("testing ", req.client.cart);
      const client = req.client;
      console.log("WTF " + client);
      client.cart.push(product);
      client.saveClient();
      return res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

exports.postRemoveFromCart = (req, res) => {
  prodId = req.body.productId;
  const client = req.client;

  client
    .deleteItemFromCart(prodId)
    .then((result) => {
      console.log("yes!");
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

exports.postRemoveAllFromCart = (req, res) => {
  const client = req.client;
  client.deleteAllFromCart().then((result) => {
    console.log("yes!");
    res.redirect("/cart");
  });
};

exports.getCheckoutPage = (req, res) => {
  console.log("here");
  res.render("shop/checkout", {
    cart: req.client.cart,
  });
};

exports.getSuccessPage = async (req, res) => {
  // assign payment for each designer
  const products = req.client.cart;
  for (let product of products) {
    Designer.findAndPay(product.designer._id, parseFloat(product.price)*0.3);
    
  }

  // empty the client's cart
  req.client.cart = [];
  req.client
    .saveClient()
    .then((result) => {
      res.render("shop/success");
    })
    .catch((err) => console.error(err));
};

exports.getCancelPage = (req, res) => {
  res.render("shop/cancel");
};

exports.postCheckout = async (req, res) => {
  return stripe.checkout.sessions
    .create({
      line_items: req.client.cart.map((product) => ({
        name: product.title,
        description: product.description,
        currency: "usd",
        quantity: 1,
        amount: Math.round(product.price * 100),
      })),

      mode: "payment",
      success_url: req.protocol + "://" + "localhost:3000/success",
      cancel_url: req.protocol + "://" + "localhost:3000/cancel",
    })
    .then((session) => {
      res.render("shop/checkout", {
        sessionURL: session.url,
        cart: req.client.cart,
      });
    });
};
