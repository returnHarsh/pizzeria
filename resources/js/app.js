import axios from 'axios';
import Noty from "noty";


let  addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector("#cartCounter");

const updateCart = (pizza)=>{

    //  url where data is being send that is ("/update-cart")
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
