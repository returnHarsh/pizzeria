import axios from 'axios';
import Noty from "noty";
import initAdmin from "./admin";
import moment from 'moment';


//  add to cart functionlaity
let  addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector("#cartCounter");

const updateCart = (pizza)=>{

    //  url where data is being send that is ("/update-cart") and the second paramater is the data which we are sendin
    axios.post('/update-cart' , pizza).then(res=>{
        cartCounter.innerHTML = res.data.totalQty;

        // for successfull add to cart message
        new Noty({
            type : 'success', 
            timeout : '1000',
            text : 'Item added to cart',
        }).show();
    }).catch(err=>{

        //   for not successful cart
        new Noty({
            type : 'success', 
            timeout : '1000',
            text : 'something went wrong',
        }).show();
    })
}

addToCart.forEach((item)=>{
    item.addEventListener("click" , (e)=>{
        let pizza = JSON.parse(item.dataset.pizza);

        //  passing that cart data into update cart function
        updateCart(pizza);
    })
})


const alertMsg = document.querySelector("#success-alert");
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    } , 2000);
}




let statuses = document.querySelectorAll(".status_line");
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ?  hiddenInput.value : null;
order = JSON.parse(order);

//  creating an element
let time = document.createElement("small");


//  change order status
function updateStatus(order){

    statuses.forEach((status)=>{
        status.classList.remove('step-completed');
        status.classList.remove('current');
    })


    let stepCompleted = true;

    statuses.forEach(status=>{
       let dataProp = status.dataset.status;

       if(stepCompleted){
        status.classList.add('step-completed');
       }

       if(dataProp === order.status){
        stepCompleted = false;
        time.innerHTML = moment(order.updatedAt).format('hh:mm A');
        status.appendChild(time);

        if(status.nextElementSibling){
            status.nextElementSibling.classList.add('current');
        }

       }

    })

}

updateStatus(order);


//  socket
let socket = io();
initAdmin(socket);

//  join
if(order)
{
socket.emit("join" , `order_${order._id}`);
}

let adminAreaPath = window.location.pathname;

if(adminAreaPath.includes('admin')){
    socket.emit("join" , 'adminRoom');
}


socket.on('orderUpdated' , (data)=>{

    const updatedOrder = {...order}
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    updateStatus(updatedOrder);


//  success message
    new Noty({
        type : 'success', 
        timeout : '1000',
        text : 'order updated',
    }).show();

})


