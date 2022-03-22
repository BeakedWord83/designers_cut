exports.clientIsLoggedIn = (req, res, next) => {
   
        if (req.session.isClientLoggedIn) {
            next();
        } else {
           return res.redirect('/login');
        }
   
}

exports.designerIsLoggedIn = (req, res, next) => {
        if (req.session.designerIsLoggedIn) {
            next();
        } else {
           return res.redirect('/designer-login');
        }
  
}
