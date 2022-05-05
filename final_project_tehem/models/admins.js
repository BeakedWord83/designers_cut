const getDb = require("../utils/database").getDb;
const superAdmin = require("./superAdmin");
const mongodb = require("mongodb");

class Admin extends superAdmin {
  constructor(id, username, password, firstName, lastName, address) {
    super(username, password, false);
    this._id = id ? mongodb.ObjectId() : null;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
  }

  saveAdmin() {
    const db = getDb();
    let dbOps;
    if (this._id) {
      dbOps = db
        .collection("admin")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOps = db.collection("admin").insertOne(this);
    }
    return dbOps
      .then((result) => result)
      .catch((error) => console.log(error));
  }

  loginAdmin() {
    const db = getDb();
    return db
      .collection("admin")
      .findOne({ username: this.username, password: this.password })
      .then((admin) => {
        if (!admin) {
          return null;
        }
        return admin;
      })
      .catch((err) => console.log(err));
  }
  static fetchAll() {
    const db = getDb();
    return db
      .collection("admin")
      .find( {isSuperAdmin: false})
      .toArray()
      .then((admins) => {
        console.log(admins.length)
        return admins;
      })
      .catch((err) => console.log(err));
  }

  static fetchById(id) {
    const db = getDb();
    console.log("test " + id);
    return db
      .collection("admin")
      .findOne({ _id: mongodb.ObjectId(id) })
      .then((admin) => {
        if (!admin) {
          return null;
        }
        return admin;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection("admin")
      .deleteOne({ _id: mongodb.ObjectId(id) })
      .then((result) => result)
      .catch((err) => console.log(err));
  }


}

module.exports = Admin;
