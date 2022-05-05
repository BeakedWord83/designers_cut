exports.clientIsLoggedIn = (req, res, next) => {
   
        if (req.session.isClientLoggedIn) {
            next();
        } else {
        req.flash('error', 'Please login first');
           return res.redirect('/login');
        }
   
}

exports.designerIsLoggedIn = (req, res, next) => {
        if (req.session.isDesignerLoggedIn) {
            next();
        } else {
           return res.redirect('/designer-login');
        }
  
}

exports.superAdminIsLoggedIn = (req, res, next) => {
    if (req.session.isSuperAdminLoggedIn) {
        next();
    } else {
       return res.redirect('/admin/super-admin-login');
    }

}


exports.adminIsLoggedIn = (req, res, next) => {
        if (req.session.isAdminLoggedIn || req.session.isSuperAdminLoggedIn) {
            next();
        } else {
           return res.redirect('/admin/admin-login');
        }
  
}