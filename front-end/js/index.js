//get elements
const products = document.getElementById('products');
const cartIconNumber = document.getElementById('cart-icon-number');

//API URL
const api = 'http://localhost:3000/api/cameras/';

//Single Product Link
const singleProductLink = './single-product.html';
 

function getItemsRequest() {
    return new Promise ((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', api);
        request.onreadystatechange = () => {
            if(request.readyState === 4) {
                if(request.status === 200 || request.status === 201) {
                    resolve(JSON.parse(request.response));
                } else {
                    reject('request get error');
                }
            }
        }
        request.send();
    });
}

async function getItemsResponse () { 
    try {
    const requestPromise = getItemsRequest();
    const response = await requestPromise;
    createCards(response);
    } catch (error) {
        console.log(error);
    }
} 

//create product and print to DOM 
function createCards (obj) {
    for (let i in obj) {
            let newCardDiv = document.createElement('div');
            let newCardImg = document.createElement('img');
            let newCardTitle = document.createElement('h3');;
            let newCardPrice = document.createElement('p');
            let newCardBtn = document.createElement('button');
            let newCardLink = document.createElement('a');

            newCardDiv.classList.add('product');
            newCardImg.setAttribute('src', obj[i].imageUrl);
            newCardImg.classList.add('product-img');
            newCardTitle.innerText = `${obj[i].name}`;
            newCardPrice.innerText = `$  ${obj[i].price / 100}`;
            newCardLink.setAttribute('href', `${singleProductLink}?id=${obj[i]._id}`);
            newCardBtn.innerText = 'View Info';

            newCardDiv.appendChild(newCardImg);
            newCardDiv.appendChild(newCardTitle);            
            newCardDiv.appendChild(newCardPrice);
            newCardDiv.appendChild(newCardLink);
            newCardLink.appendChild(newCardBtn);
            products.appendChild(newCardDiv);
    }
}

getItemsResponse();
getCartNumber();


function getCartNumber () {
    let localstorageProducts = localStorage.getItem('cartProducts');
    if (localstorageProducts) {
        localstorageProducts = JSON.parse(localStorage.getItem("cartProducts"));
        let inCart = 0;
        for (let i =0; i < localstorageProducts.length; i++) {
            inCart += localstorageProducts[i].inCart;
            cartIconNumber.textContent = inCart;
            cartIconNumber.style.color = 'red';
        }        
    } else {
        cartIconNumber.textContent = 0;
        cartIconNumber.style.color = 'black';
    }  
}



/*
function  getCartNumber() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        cartIconNumber.innerText = `${productNumbers}`;
        cartIconNumber.style.color = 'red';
    }  
}
*/