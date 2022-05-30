const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class Design{
    constructor(imagePath, imageName)
    {   
        this.id = new ObjectId();
        this.imagePath = imagePath;
        this.imageName = imageName;
    }
}

module.exports = Design;