require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const initRoutes = require("./routes/web");
const mongoose  = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDBstore  = require("connect-mongo");


const PORT = process.env.PORT;


//  Assets
app.use(express.static('public'));

app.use(express.json());




//  Database connection
const url = process.env.MONGO_CONNECTION_URL;
mongoose.connect(url);
const connection = mongoose.connection;
connection.once("open" , ()=>{
    console.log("database connected");
})




//  setting sessions
app.use(session({
    secret : process.env.COOKIES_SECRET,
    resave : false,
    store : MongoDBstore.create({
        mongoUrl : process.env.MONGO_CONNECTION_URL,
    }),
    saveUninitialized : false,
    cookie : {maxAge : 1000*60*60*24}  //24 hours in time
}));


//  global middleware
app.use((req , res , next)=>{
    res.locals.session = req.session;
    next();
})




//  setting the template engine
app.use(expressLayout);
app.set("views" , path.join(__dirname , '/resources/views'));
app.set('view engine' , 'ejs');


//  all links routing here
initRoutes(app);






app.listen(PORT , ()=>{
    console.log("server online");
})