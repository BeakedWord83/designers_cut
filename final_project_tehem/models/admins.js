const getDb = require('../utils/database').getDb;
const mongodb = require('mongodb');

class Admin
{
    constructor(id,username, password, superAdmin){
        this._id = mongodb.ObjectId(id);
        this.username = username;
        this.password = password;
        this.superAdmin = superAdmin;
    }


    
    saveAdmin()
    {
        if (this.superAdmin) {
        const db = getDb();
        let dbOps;
        if (this._id)
        {
            dbOps = db.
            collection('admins')
            .updateOne({_id: this._id}, {$set: this});
        }
        else {
            dbPops = db.
            collection('admins')
            .insertOne(this);
        }
        return dbOps
        .then(result=> console.log(result))
        .catch(error=> console.log(error));
    }

    else {
        return "You need Super Admin Permission to perform this operation";
    }
}
    
    

}

module.exports = Admin