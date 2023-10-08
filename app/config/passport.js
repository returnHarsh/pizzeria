const localStratergy = require("passport-local").Strategy;
const User = require('../models/user');
const bcrypt = require("bcrypt");

const init= (passport)=>{
    passport.use(new localStratergy({usernameField : 'email'} , async(email , password , done)=>{
        //  login logic
        //  check if email exists in database
        const user = await User.findOne({email : email})

        
        if(!user){
            return done(null , false , {message : "No user with this email found"});
        }

        bcrypt.compare(password , user.password).then(match =>{
            if(match){
                return done(null , user , {message : "Logged in Successfully"} );
            }

            return done(null , false , { message : "wrong username or password"});
        }).catch(err=>{
            return done(null , false , {message : "Something went wrong"});
        })

        // passport ends here
    }))

    //  after successfull logged in we need to store something in session 
    passport.serializeUser((user , done)=>{
        done(null , user._id);
    })

    
    passport.deserializeUser((id , done)=>{
        User.find({_id : id }).then(res=>{
            done(null , res);
        })
    })

    
}

module.exports = init;