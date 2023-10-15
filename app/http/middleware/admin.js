function admin(req , res , next){
    if(req.user[0].role === "admin")
    {
        next();
    }
    else{
        return res.redirect('/');
    }
  
}

module.exports = admin;