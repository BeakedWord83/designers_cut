const db = require("../utils/database").getDb;
const mongodb = require("mongodb");

class Designer {
  constructor(id, username, password, description, imagePath, wallet) {
    this._id = id ? mongodb.ObjectId(id) : null;
    this.username = username;
    this.password = password;
    this.description = description;
    this.imageUrl = imagePath;
    this.wallet = wallet;
  }

  saveDesigner() {
    let dbOp;
    if (this._id) {
      dbOp = db()
        .collection("Designers")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db().collection("Designers").insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static login(username, password) {
    console.log(username, password);
    return db()
      .collection("Designers")
      .findOne({ $and: [{ username: username }, { password: password }] })
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }

  static fetchByUsername(username) {
    return db()
      .collection("Designers")
      .find({ username: username })
      .next()
      .then((designer) => {
        return designer;
      });
  }

  static fetchById(id) {
    return db()
      .collection("Designers")
      .findOne({ _id: id })
      .then((designer) => {
        return designer;
      });
  }

  static findAndPay(id, amount) {
    return db()
      .collection("Designers")
      .updateOne({ _id: id }, { $inc: { wallet: amount } })
      .then((result) => {
        console.log("success");
      })
      .catch((err) => console.log(err));
  }

  static deleteByid(username) {
    return db()
      .collection("Designers")
      .deleteOne({ username: username })
      .then((result) => {
        console.log("Account deleted successfully");
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Designer;
