const homeController = require('../app/http/controllers/homeController');
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/cartController");
const guest = require('../app/http/middleware/guest');

function initRoutes(app){
    
app.get('/', homeController().index);

app.get('/cart' , cartController().index);

app.get("/login" , guest ,  authController().login);

app.post("/login" , authController().postLogin )

app.post('/logout' , authController().logout);

app.get("/register" , guest , authController().register);

app.post('/register' ,  authController().postRegister);

app.post('/update-cart' , cartController().update);

app.get('/session' , (req , res)=>{
    res.send(req.session);
})

}

module.exports = initRoutes;