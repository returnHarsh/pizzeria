const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");

const PORT = 3000;

app.get("/" , (req , res)=>{
    res.render("home");
})

//  setting the template engine
app.use(expressLayout);
app.set("views" , path.join(__dirname , '/resources/views'));
app.set('view engine' , 'ejs');


//  Assets
app.use(express.static('public'));


app.listen(PORT , ()=>{
    console.log("server online on port 3000");
})