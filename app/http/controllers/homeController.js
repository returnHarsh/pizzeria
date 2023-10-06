const Menu = require('../../models/menu');
function homeController(){
    // factory functino is the function that returns object

    return{
        index :  async function(req , res){
            const pizzas =await Menu.find();
            return res.render('home' , {pizzas : pizzas});
        }
    }
}

module.exports = homeController;
