const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// Create a mongodb connection
const MONGODB_URI = 'mongodb+srv://katriel_b:QfagA8HYAso1Ccr2@cluster0.mf9sk.mongodb.net/Designers?retryWrites=true&w=majority';
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

