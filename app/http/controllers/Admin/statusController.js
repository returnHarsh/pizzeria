const Order = require("../../../models/order");

function statusController(){

    return{
        update : function(req , res){
            Order.updateOne({_id : req.body.orderId} , {status : req.body.status}).then(data=>{

                //  emitt event
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit("orderUpdated" , {id : req.body.orderId , status : req.body.status});

                return res.redirect('/admin/orders');
                
            }).catch(err=>{
                console.log(err);
                return res.redirect('/admin/orders');
            })
        }
    }

}

module.exports = statusController;