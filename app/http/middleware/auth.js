function auth (req , res , next)
{
    if(req.isAuthenticated()){
        next();
    }
    else{
        return res.redirect('/login');
    }
}

module.exports = auth;