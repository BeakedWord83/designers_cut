const db = require("../utils/database").getDb;
const mongodb = require("mongodb");

class Client {
  constructor(id, username, email, companyName, password, cart) {
    this._id = id!=null ? mongodb.ObjectId(id) : null;
    this.username = username;
    this.email = email;
    this.password = password;
    this.companyName = companyName;
    this.cart = cart;
  }

  saveClient() {
    let dbOp;
    if (this._id) {
      dbOp = db()
        .collection("Clients")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db().collection("Clients").insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.filter((product) => {
      return product._id.toString() !== productId.toString();
    });
    return db()
      .collection("Clients")
      .updateOne(
        { _id: mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCartItems } }
      );
  }


  deleteAllFromCart()
  {
    this.cart = [];
    return this.saveClient();
  }

  static findById(id) {
    return db()
      .collection("Clients")
      .findOne({ _id: id })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  static login(email, password) {
    return db()
      .collection("Clients")
      .findOne({ email: email, password: password })
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Client;
