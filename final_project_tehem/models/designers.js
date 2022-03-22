const db = require("../utils/database").getDb;
const mongodb = require("mongodb");

class Designer {
  constructor(id, username, password, description, imagePath) {
    this._id = mongodb.ObjectId(id);
    this.username = username;
    this.password = password;
    this.description = description;
    this.imageUrl = imagePath;
  }

  saveDesigner() {
    return db()
      .collection("Designers")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }


  static login(username, password) {
    console.log(username, password);
    return db()
      .collection("Designers")
      .findOne({$and: [{ username: username}, {password: password }]})
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
