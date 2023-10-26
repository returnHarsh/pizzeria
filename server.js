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
const passport = require("passport");
const Emitter = require("events");


const PORT = process.env.PORT;

app.use(flash());

//  Assets
app.use(express.static('public'));

//  by default express ko pta nhi hota ki usko kis type ka data recieve hota h to hume use batana padta h by usinh using those middlewares like 1) one for form data and 2) one for json type data
app.use(express.urlencoded({extended : false}))
app.use(express.json());




//  Database connection
const DBconnection = async()=>{
    const url = process.env.MONGO_CONNECTION_URL;
mongoose.connect(url);
const connection = await mongoose.connection;
connection.once("open" , ()=>{
    console.log("database connected");
})
}

DBconnection();



//  event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter' , eventEmitter);
const backUpEmitter = new Emitter();


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

//  passport configuration
const passportInit = require("./app/config/passport");
const { Server } = require("http");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());


//  global middleware
app.use((req , res , next)=>{
    res.locals.session = req.session;
    res.locals.user= req.user;
    next();
})


//  setting the template engine
app.use(expressLayout);
app.set("views" , path.join(__dirname , '/resources/views'));
app.set('view engine' , 'ejs');


//  all links routing here
initRoutes(app);

app.use((req , res)=>{
    res.status(404).render('error/404')
})






const server = app.listen(PORT , ()=>{
    console.log("server online");
})



//  socket connection
const io = require('socket.io')(server);

io.on('connection' , (socket)=>{
    socket.on("join" , (roomName)=>{
        socket.join(roomName);
    })

    
})

eventEmitter.on("orderUpdated" , (data)=>{
    io.to(`order_${data.id}`).emit("orderUpdated" , data);
 })

 eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})















