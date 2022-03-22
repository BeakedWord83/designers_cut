const getDb = require('../utils/database').getDb;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class Product {
    constructor(title, type, price, description, imageUrl, id, designerId) {
        this.title = title;
        this.type = type;
        this.price = price;
        this.description = description; 
        this.imageUrl = imageUrl;
        this._id = id !=null ? new mongodb.ObjectId(id): null;
        this.designerId = designerId;
    }

    saveProduct() {
    const db = getDb();
    let dbOp;
    if (this._id) {
        dbOp = db
        .collection('Products')
        .updateOne({_id: this._id}, {$set: this});
    }
    else {
        dbOp = db
        .collection('Products')
        .insertOne(this);
    }
    return dbOp
    .then(result =>{
        console.log(result);
    })
    .catch(err =>console.log(err));

    }

    static fetchAll() {
        const db = getDb();
        return db
        .collection('Products')
        .find()
        .toArray()
        .then(products => {
            return products;
        })
        .catch(err => console.log(err));
    }

    static fetchByType(type) {
        const db = getDb();
        return db
        .collection('Products')
        .find({type: type})
        .next()
        .then(products => {
            console.log(product);
            return products;
        })
        .catch(err => console.log(err));
    }
    static fetchById(prodId) {
        console.log("in function " + prodId);
        const db = getDb();
        return db
        .collection('Products')
        .find({_id: ObjectId(prodId)})
        .next()
        .then(product => {
            console.log(product);
            return product;
        })
        .catch(err => console.log(err));

    }

    static deleteById(prodId) {
        const db = getDb();
        return db
        .collection('Products')
        .deleteOne({_id: ObjectId(prodId)})
        .then((result) =>{
            console.log("Product has been deleted successfully!");
        })
        .catch(err => console.log(err));
    }  
}

module.exports = Product;