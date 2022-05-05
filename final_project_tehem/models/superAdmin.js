const getDb = require("../utils/database").getDb;


class superAdmin
{ 
    constructor(username, password, isSuperAdmin)
    {
        this.username = username;
        this.password = password;
        this.isSuperAdmin = isSuperAdmin;
    }

    superAdminLogin()
    {
        const db = getDb();
        return db
            .collection("admin")
            .findOne({ username: this.username, password: this.password, isSuperAdmin: this.isSuperAdmin })
            .then((superAdmin) => {
                if (!superAdmin) {
                    return null;
                }
                return superAdmin;
            })
            .catch((err) => console.log(err));
    }
}

module.exports = superAdmin;