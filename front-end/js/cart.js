//get elements
const cartIconNumber = document.getElementById('cart-icon-number');
const tableContainer = document.getElementById('cart-products-container');
const productTableBody = document.querySelector('.products-wrip');
const delBtns = document.getElementsByClassName('product-del-btn');
const decreasBtns = document.getElementsByClassName('product-quantity-decreas-btn');
const increasBtns = document.getElementsByClassName('product-quantity-increas-btn');
const quantityinputs = document.getElementsByClassName('product-qty');
const submitBtn = document.querySelector('.submit-btn');


const api = 'http://localhost:3000/api/cameras/order';


function showProducts() {
    let localstorageProducts = localStorage.getItem('cartProducts');
    if (localstorageProducts) {
        localstorageProducts = JSON.parse(localStorage.getItem("cartProducts"));   

        for (let i = 0; i < localstorageProducts.length; i++) {          
            
            let productRow = document.createElement('tr');
            productRow.classList.add('product-row')        
            
            let productName = document.createElement('td');
            productName.textContent = localstorageProducts[i].name;

            let productType = document.createElement('td');
            productType.textContent = localstorageProducts[i].lenses;

            let productUnitPrice = document.createElement('td');
            productUnitPrice.classList.add('product-price');
            productUnitPrice.textContent = '$' + localstorageProducts[i].price / 100;

            let productQuantityWrip = document.createElement('td');
            productQuantityWrip.classList.add('product-qty-wrip')

            let productQuantityDecreasBtn = document.createElement('button');
            productQuantityDecreasBtn.classList.add('product-quantity-decreas-btn');        
            productQuantityDecreasBtn.textContent = '-';

            let productQuantity = document.createElement('input');
            productQuantity.classList.add('product-qty');
            productQuantity.setAttribute('type', 'number');
            productQuantity.setAttribute('pattern', '[0-9]');
            productQuantity.value = localstorageProducts[i].inCart;

            let productQuantityIncreasBtn = document.createElement('button');
            productQuantityIncreasBtn.classList.add('product-quantity-increas-btn');
            
            productQuantityIncreasBtn.textContent = '+';

            let productLinePrice = document.createElement('td');
            productLinePrice.textContent = '$' + (localstorageProducts[i].price / 100) * localstorageProducts[i].inCart;
            
            let productDelBtnWrip = document.createElement('td');
            
            let productDelBtn = document.createElement('button');
            productDelBtn.classList.add('product-del-btn'),
            productDelBtn.textContent = 'Delete';
            
            productRow.appendChild(productName); 
            productRow.appendChild(productType);
            productRow.appendChild(productUnitPrice);
            productRow.appendChild(productQuantityWrip);
            productRow.appendChild(productLinePrice);
            productRow.appendChild(productDelBtnWrip);
            productQuantityWrip.appendChild(productQuantityDecreasBtn);
            productQuantityWrip.appendChild(productQuantity);
            productQuantityWrip.appendChild(productQuantityIncreasBtn);
            productDelBtnWrip.appendChild(productDelBtn);
            productTableBody.appendChild(productRow);          
        }
    } else {
        let reminder = document.createElement('h3');
        reminder.textContent = 'Not have any product.';
        tableContainer.appendChild(reminder);
    }
}

showProducts();


for (let i = 0; i < delBtns.length;i++) {
        let delButton = delBtns[i];
        delButton.addEventListener('click', removeCartProduct);
}

function removeCartProduct(event) {
    let delButtonClicked = event.target;
    delButtonClicked.parentElement.parentElement.remove();

    let productName = delButtonClicked.parentElement.parentElement.children[0].textContent;
    let productType = delButtonClicked.parentElement.parentElement.children[1].textContent;    
    let localstorageProducts = localStorage.getItem('cartProducts');
    localstorageProducts = JSON.parse(localStorage.getItem("cartProducts"));
    let index = localstorageProducts.findIndex(object => object.name == productName && object.lenses == productType);
        
    localstorageProducts.splice(index,1);
    localStorage.setItem('cartProducts', JSON.stringify(localstorageProducts));
    
    if (localstorageProducts.length === 0) {
        localStorage.removeItem('cartProducts');
    }
    getCartNumber();
    productsTotal();

}

for (let i = 0; i < increasBtns.length; i++) {
    let increaseBtn = increasBtns[i];
    increaseBtn.addEventListener('click', increaseQuantity);   
}

function increaseQuantity(event) {
    let increaseBtnClicked = event.target;
    increaseBtnClicked.previousElementSibling.value++;    

    let productName = increaseBtnClicked.parentElement.parentElement.children[0].textContent;
    let productType = increaseBtnClicked.parentElement.parentElement.children[1].textContent;
    let linkPrice = increaseBtnClicked.parentElement.parentElement.children[4];
    let unitPrice = increaseBtnClicked.parentElement.parentElement.children[2];
    linkPrice.textContent = '$' + unitPrice.textContent.replace('$', '') * increaseBtnClicked.previousElementSibling.value;
    
    let localstorageProducts = localStorage.getItem('cartProducts');
    localstorageProducts = JSON.parse(localStorage.getItem("cartProducts"));
    let index = localstorageProducts.findIndex(object => object.name == productName && object.lenses == productType);
    localstorageProducts[index].inCart++;
    localStorage.setItem('cartProducts', JSON.stringify(localstorageProducts));
    getCartNumber();
    productsTotal();
}


for (let i = 0; i < decreasBtns.length; i++) {
    let decreasBtn = decreasBtns[i];
    decreasBtn.addEventListener('click', decreasQuantity);
}

function decreasQuantity(event) {
    let decreasBtnClicked = event.target;
    decreasBtnClicked.nextElementSibling.value--;

    if (decreasBtnClicked.nextElementSibling.value <= 0){
        return decreasBtnClicked.nextElementSibling.value = 1;
    }

    let productName = decreasBtnClicked.parentElement.parentElement.children[0].textContent;
    let productType = decreasBtnClicked.parentElement.parentElement.children[1].textContent;
    let linkPrice = decreasBtnClicked.parentElement.parentElement.children[4];
    let unitPrice = decreasBtnClicked.parentElement.parentElement.children[2];    
    linkPrice.textContent = '$' + unitPrice.textContent.replace('$', '') * decreasBtnClicked.nextElementSibling.value;

    let localstorageProducts = localStorage.getItem('cartProducts');
    localstorageProducts = JSON.parse(localStorage.getItem("cartProducts"));
    let index = localstorageProducts.findIndex(object => object.name == productName && object.lenses == productType);
    localstorageProducts[index].inCart--;
    if (localstorageProducts[index].inCart <= 0) {
        return localstorageProducts[index].inCart = 1;
    }
    localStorage.setItem('cartProducts', JSON.stringify(localstorageProducts));
    getCartNumber();
    productsTotal();
}

for (let i = 0; i < quantityinputs.length; i++) {
    let qtyInput = quantityinputs[i]
    qtyInput.addEventListener('change', quantityChange)
}

function quantityChange(event) {
    let  qtyInputChanged = event.target
    if (isNaN(qtyInputChanged.value) || qtyInputChanged.value <= 0) {
        qtyInputChanged.value = 1; 
    } else {
        qtyInputChanged.value =  Math.round(qtyInputChanged.value);
        if ( Math.round(qtyInputChanged.value) === 0) {
            qtyInputChanged.value = 1;
        }
    }

    let productName = qtyInputChanged.parentElement.parentElement.children[0].textContent;
    let productType = qtyInputChanged.parentElement.parentElement.children[1].textContent;
    let linkPrice = qtyInputChanged.parentElement.parentElement.children[4];
    let unitPrice = qtyInputChanged.parentElement.parentElement.children[2];    
    linkPrice.textContent = '$' + unitPrice.textContent.replace('$', '') * qtyInputChanged.value;

    let localstorageProducts = localStorage.getItem('cartProducts');
    localstorageProducts = JSON.parse(localStorage.getItem("cartProducts"));
    let index = localstorageProducts.findIndex(object => object.name == productName && object.lenses == productType);
    localstorageProducts[index].inCart = parseInt(qtyInputChanged.value);
    localStorage.setItem('cartProducts', JSON.stringify(localstorageProducts));
    getCartNumber();
    productsTotal();
}

function productsTotal() {
    let localstorageProducts = localStorage.getItem('cartProducts');
    localstorageProducts = JSON.parse(localStorage.getItem("cartProducts"));
    
    if (localstorageProducts) {
        let tableBody = document.querySelector('.products-wrip');
        let tableRows = tableBody.getElementsByClassName('product-row');    
        let productsTotal = document.querySelector('.products-total');
        let total = 0;
        for (let i = 0; i < tableRows.length; i++) {
            let tableRow = tableRows[i];
            let tableRowPriceElement = tableRow.querySelector('.product-price');
            let tableRowPrice = tableRowPriceElement.textContent.replace('$', '');
            let tableRowQuantityElement = tableRow.querySelector('.product-qty-wrip');
            let tableRowQuantity = tableRowQuantityElement.querySelector('.product-qty');

            total = total + (tableRowPrice * tableRowQuantity.value);                
            productsTotal.textContent = 'Total Amount:$ ' + total;            
        }
          
    }  else {
        let productsTotal = document.querySelector('.products-total');
        productsTotal.textContent = '';
    }
}
productsTotal();

getCartNumber();

submitForm();

function submitForm() {
    submitBtn.addEventListener('click', (event) => {
        event.preventDefault();
        let products = [];
        let contact = {};
        let isFormValid = checkInputs();
        let isCartValid = checkProducts();
        console.log("form valid =" + isFormValid);
        console.log("cart valid =" + isCartValid);

        if (isFormValid == true && isCartValid == true){
            getInputsData(contact);
            getProductsId(products);
            let post = {
                contact,
                products
            };
            submitFormData(post);              
        }
    })    
}


async function submitFormData(post) {
    try {
        const requestPromise = makeRequest(post);
        const response = await requestPromise;
        console.log(response);
        localStorage.setItem('orderId', JSON.stringify(response.orderId));
        localStorage.setItem('userContact', JSON.stringify(response.contact));
        window.location.href = './confirmation-page.html';
    }
    catch (error) {
        console.log('some error in submitFormData :' + error);
    }  
}


function makeRequest(post) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('POST', api);
        request.onreadystatechange = () => {
            if(request.readyState === 4) {
                if (request.status === 200 || request.status === 201) {
                    resolve(JSON.parse(request.response));
                } else {
                    reject('request error');
                }
            }
        }
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(post));
    });    
}

function checkProducts() {
    let localstorageProducts = localStorage.getItem('cartProducts');
    let valid = false;
    if (localstorageProducts) {
        localstorageProducts = JSON.parse(localStorage.getItem("cartProducts"));
        for (let i = 0; i < localstorageProducts.length; i++) {
            if (localstorageProducts[i].inCart <= 0 || Number.isInteger(localstorageProducts[i].inCart) == false) {
                alert ("Cart data error,plase delete product and reflash the pages");
                return valid;

            } else {
                if (localstorageProducts[i].inCart >= 1 && localstorageProducts[i]._id !== null && localstorageProducts[i].lenses !== null) {
                    valid = true;
                    return valid;
                }               
            }
        }
    } else {
        alert("Not have any products in cart,can't make order!");
        return valid;
    }
}

function checkInputs() {    
    const letters = /^[A-Za-z]+(?:[\s][A-Za-z]+)*$/;
    const address = /^[0-9a-zA-Z,#]+(?:[\s][0-9a-zA-Z-,.#]+)*$/;
    const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let fnameChecked = false;
    let lnameChecked = false;
    let addressChecked = false;
    let cityChecked = false;
    let emailChecked = false;
    let valid = false;

    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const addressInput = document.getElementById('address');
    const cityInput = document.getElementById('city');
    const emailInput = document.getElementById('email');
    const fnameError = document.querySelector('.first-name-error');
    const lnameError = document.querySelector('.last-name-error');
    const addressError = document.querySelector('.address-error');
    const cityError = document.querySelector('.city-error');
    const emailError = document.querySelector('.email-error');

    if (firstNameInput.value.match(letters)) {
        fnameChecked = true;
        fnameError.textContent = "";
        fnameError.setAttribute('aria-hidden', 'true');
        console.log("fname pass =" + fnameChecked);
    } else {
        fnameError.textContent = "Please check first name,alphabet characters only";
        fnameError.style.color = 'red';
        fnameError.setAttribute('aria-hidden', 'false');
        console.log("fname pass =" + fnameChecked);
    }

    if (lastNameInput.value.match(letters)) {
        lnameChecked = true;
        lnameError.textContent = "";
        lnameError.setAttribute('aria-hidden', 'true');
        console.log("lname pass =" + lnameChecked);
    } else {
        lnameError.textContent = "Please check last name,alphabet characters only";
        lnameError.style.color = 'red';
        lnameError.setAttribute('aria-hidden', 'false');
        console.log("lname pass =" + lnameChecked);
    }
    
    if (addressInput.value.match(address)) {
        addressChecked = true;
        addressError.textContent = "";
        addressError.setAttribute('aria-hidden', 'true');
        console.log("address pass =" + addressChecked);
    } else {
        addressError.textContent = "Please check address,alphanumeric characters only";
        addressError.style.color = 'red';
        addressError.setAttribute('aria-hidden', 'false');
        console.log("address pass =" + addressChecked);
    }

    if (cityInput.value.match(letters)) {
        cityChecked = true;
        cityError.textContent = "";
        cityError.setAttribute('aria-hidden', 'true');
        console.log("city pass =" + cityChecked);
    } else {
        cityError.textContent = "Please check city, alphabet characters only";
        cityError.style.color = 'red';
        cityError.setAttribute('aria-hidden', 'false');
        console.log("city pass =" + cityChecked);
    }

    if (emailInput.value.match(email)) {
        emailChecked = true;
        emailError.textContent = "";
        emailError.setAttribute('aria-hidden', 'true');
        console.log("email pass =" + emailChecked);
    } else {
        emailError.textContent = "Please check email format.";
        emailError.style.color = 'red';
        emailError.setAttribute('aria-hidden', 'false');
        console.log("email pass =" + emailChecked);
    }

    if (fnameChecked == true && lnameChecked == true && addressChecked == true && cityChecked == true && emailChecked == true) {
        valid = true;
        return valid;
    } else {
        return valid;
    }
}

function getInputsData(object) {
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const addressInput = document.getElementById('address');
    const cityInput = document.getElementById('city');
    const emailInput = document.getElementById('email');

    object.firstName = firstNameInput.value;
    object.lastName =  lastNameInput.value;
    object.city = cityInput.value;
    object.address = addressInput.value;
    object.email = emailInput.value; 
    
    return object;    
}

function getProductsId(array) {
    let localstorageProducts = localStorage.getItem('cartProducts');
    localstorageProducts = JSON.parse(localStorage.getItem("cartProducts"));
    
    for (let i = 0; i < localstorageProducts.length; i++) {
        array.push(localstorageProducts[i]._id);
    }
    return array;
}

function getCartNumber () {
    let localstorageProducts = localStorage.getItem('cartProducts');
    if (localstorageProducts) {
        localstorageProducts = JSON.parse(localStorage.getItem("cartProducts"));
        let inCart = 0;
        for (let i = 0; i < localstorageProducts.length; i++) {
            inCart += localstorageProducts[i].inCart;
            cartIconNumber.textContent = inCart;
            cartIconNumber.style.color = 'red';
        }        
    } else {
        cartIconNumber.textContent = 0;
        cartIconNumber.style.color = 'black';
    }  
}



