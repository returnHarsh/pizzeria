function guest(req , res , next){

    // ye function mujhe passport ki wajah se mil rhi
    if(!req.isAuthenticated()){
        next();
    }
    
    else{
        return res.redirect('/');
    }

}

module.exports = guest;