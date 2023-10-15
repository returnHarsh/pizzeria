const flash = require("express-flash");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

function authController() {

    const _getRedirectUrl = (req)=>{
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }

    return{
        login : function(req ,res){
            res.render("auth/login");
        },
        postLogin : function(req , res , next){

            // ion this  the second callback funciton that is (err , user , info ) is the "done" function we have used in passport.js
            passport.authenticate('local' , (err , user , info)=>{

                if(err)
                {
                    req.flash("error" , info.message);
                    return next();
                }
                if(!user){
                    req.flash("error" , info.message);
                    return res.redirect('/login');
                }

                req.logIn(user , (err)=>{
                    if(err){
                        req.flash("error" , info.message);
                        return next(err);
                    }

                    return res.redirect(_getRedirectUrl(req));
                })
            })(req , res , next);
        },

        register : function(req , res){
            res.render("auth/register");
        },

        postRegister :  async function(req , res){
            const { name , email , password} = req.body;

            //validate request
            if(!name || !email || !password)
            {
                req.flash('error' , "All fields are required");
                req.flash('name',name);
                req.flash('email',email);
                return res.redirect('/register');
            }

            //  check if email already exists , check for duplication
            await User.find({email : email}).then(res=>{
                req.flash("error" , "email is already registered");
            })


            await bcrypt.hash(password, 10, async function(err, hashP) {
                if(err){
                    req.flash("error" , "problem with database try again");
                    console.log("err" , err);
                }
                else {
                                     //  create a user
                 const user = new User({
                    name : name,
                    email : email,
                    password : hashP,
                })
                
           await user.save().then((userData)=>{
                //  Redirect to Login 
                return res.redirect('/');
            }).catch(err=>{
                req.flash("error" , "something went wrong");
                console.log("error with " , err);
                    return res.redirect('/register');
            })
                }
            })
        },

        logout : function(req , res){
            //  passport ki wajah se logout karna bahut simple ho gaya h
            req.logout((err  , next)=>{
                return res.redirect('/login');
            });
            
        },


    }
}

module.exports = authController;