const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// Create a mongodb connection
let _db;
const mongoConnect = (callback) => {
    MongoClient.connect(MONGODB_URI)
    .then(client => {
        console.log('Connected to MongoDB');
        _db = client.db();
        callback();
        
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
    }

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

