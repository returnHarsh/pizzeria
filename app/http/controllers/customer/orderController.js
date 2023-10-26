const Order = require('../../../models/order');
const moment = require('moment');

function orderController(){
    
    return{
        store : function(req , res){

            //  validate request
            const {phone , address} = req.body;
            if(!phone || !address){
                req.flash("error" , "please fill all fields");
                return res.redirect('/cart');
            }

//  create a new order
            const order = new Order({
                customerId : req.user[0]._id,
                items : req.session.cart.items,
                phone : phone,
                address : address
            })

            //  saving the order in database
            const orderResult = order.save();
            
            orderResult.then(res=>{
                req.flash('success' , 'order placed successfully')

                //  populate the result for socket.io
                Order.populate(res , {path : 'customerId' , }).then(result=>{
                    
                //  emit
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderPlaced', result);
                })


            }).catch(err=>{
                req.flash('error' , 'something went wrong');
            })

            if(orderResult)
            {
                delete req.session.cart;
                req.flash("success" , "order placed successfully");
                res.redirect('/customer/orders');
            }
            else{
                req.flash("error" , "something went wrong");
                res.redirect('/cart');
            }

        },

        index : async function(req , res){
            const orders = await Order.find({customerId : req.user[0]._id} , null , { sort : { 'createdAt' : -1}     })
            res.render('customers/orders' , {orders : orders , moment : moment});
        },

        show : async function(req , res){
         const order = await Order.findById(req.params.id);

         let reqUser = JSON.stringify(req.user[0]._id)
         let orderCustomer = JSON.stringify(order.customerId);

         if(reqUser == orderCustomer){
            return res.render('customers/singleOrder', { order })
        }
        return  res.redirect('/')
        }
    }
}

module.exports = orderController;