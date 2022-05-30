const getDbAPI = require("../utils/database").getDbAPI;
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

class Inventory {
  constructor(userId, designs) {
    this.userId = userId;
    this.designs = [designs];
  }

  save() {
    const db = getDbAPI();
    return db.collection("inventories").insertOne(this);
  }

  static updateInventory(inventory, userId) {
    const db = getDbAPI();
    return db
      .collection("inventories")
      .updateOne({ userId: userId }, { $set: { designs: inventory.designs } });
  }

  static addToDesigns(designs, inventory, userId) {
    console.log(inventory);
    const updatedDesigns = [...inventory.designs, designs];
    const db = getDbAPI();
    return db
      .collection("inventories")
      .updateOne({ userId }, { $set: { designs: updatedDesigns } })
      .then((result) => console.log("Designs updated!"))
      .catch((err) => console.log(err));
  }

  static deleteInventoryById(id) {
    const db = getDbAPI();
    return db.collection("inventories").deleteOne({ userId: id });
  }


  static fetchInventory(id) {
    const db = getDbAPI();
    console.log(id);
    return db.collection("inventories").findOne({ userId: id });
  }
}

module.exports = Inventory;
