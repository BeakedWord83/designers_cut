const getDb = require("../utils/database").getDb;
const Admin = require("./admins");

class superAdmin extends Admin
{ 
    constructor(username, password, isSuperAdmin)
    {
        super(username=username, password=password, isSuperAdmin=true);
    }

    
}

module.exports = superAdmin;