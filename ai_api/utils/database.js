const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnectAPI = (callback) => {
  MongoClient.connect(
  )
    .then((client) => {
      console.log("API connected to mongodb!");
      _db = client.db();
      callback(client);
    })
    
    .catch((err) => {
      console.log(err);
      throw err;
    });
};


const getDbAPI = () => {
    if (_db) {
      return _db;
    }
    throw "No database found!";
  };



exports.mongoConnectAPI = mongoConnectAPI;
exports.getDbAPI = getDbAPI;

