const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnectAPI = (callback) => {
  MongoClient.connect(
    "mongodb+srv://katriel_b:QfagA8HYAso1Ccr2@cluster0.mf9sk.mongodb.net/Designers_api?retryWrites=true&w=majority"
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

