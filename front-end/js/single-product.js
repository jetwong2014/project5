
// Get form elements
const productContainer = document.getElementById('procduct-container');
const cartIconNumber = document.getElementById('cart-icon-number');

//API URL
const api = 'http://localhost:3000/api/cameras/';

function getURLId () {
    let url = window.location.href;
    let newURL = new URL(url);
    let id = newURL.searchParams.get('id');
    return id;    
}

function getDataRequest(urlid) {
    return new Promise ((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', api + urlid);
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

async function getDataResponse() {
    try {
    const urlId = getURLId();
    const requestPromise = getDataRequest(urlId);
    const response = await requestPromise;
    createProduct(response);
    } catch (error) {
        console.log(error);
    }
}

//create product and print to DOM 
function createProduct(data) {
    let productImg = document.createElement('img');
    let productTitle = document.createElement('h2');
    let productDescription = document.createElement('p');
    let productLabel = document.createElement('label');
    let productSection = document.createElement('select');
    let productPrice = document.createElement('p');    
    let productCartBtn = document.createElement('button');

    for (let option in data.lenses) {
        let productOption = document.createElement('option');
        productOption.setAttribute('value', data.lenses[option]);
        productSection.appendChild(productOption).innerText = `${data.lenses[option]}`
    } 

    productImg.setAttribute('src', data.imageUrl);
    productImg.classList.add('single-product-img');
    productTitle.innerText = `${data.name}`;
    productDescription.innerText = `${data.description}`;
    productLabel.setAttribute('for', 'productSection');
    productLabel.innerText = 'Selcet Product Type';
    productSection.setAttribute('id', 'productSection');
    productPrice.innerText = `S ${data.price / 100}`;
    productCartBtn.innerText = 'Add To Cart';
    productCartBtn.setAttribute('id', 'addToCart');

    productContainer.appendChild(productImg);
    productContainer.appendChild(productTitle);
    productContainer.appendChild(productDescription);
    productContainer.appendChild(productLabel);
    productContainer.appendChild(productSection);
    productContainer.appendChild(productPrice);
    productContainer.appendChild(productCartBtn);

    productCartBtn.addEventListener('click', () => {
        setCartProduct(data);
        getCartNumber();
    });
    
}

function setCartProduct(data) {    
    let products = localStorage.getItem('cartProducts')?
    JSON.parse(localStorage.getItem("cartProducts")) : [];
         
    let found = false; 

    for (let i =0; i < products.length; i++) {
        if (products[i].lenses === productSection.value
            && products[i]._id === data._id) {
            products[i].inCart ++;
            found = true;
        }
    }

    if (found === false) { 
    let product = data;
    product.lenses = productSection.value;
    product.inCart = 1;
    products.push(product);
    }
   
    localStorage.setItem('cartProducts', JSON.stringify(products)); 
    
}

getDataResponse();
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

