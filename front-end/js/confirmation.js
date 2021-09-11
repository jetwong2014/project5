//get elements
userName = document.querySelector('.user-name');
userCity = document.querySelector('.user-city');
userAddress = document.querySelector('.user-address');
userEmail = document.querySelector('.user-email');
productInfoTableBody = document.querySelector('.products-info-wrap');
productInfoTableFoot = document.querySelector('.products-total-wrap');
orderId = document.querySelector('.order-id');



function showUserInfo() {
    let userInfo = localStorage.getItem('userContact');
    if (userInfo) {
        userInfo = JSON.parse(userInfo);
        userName.textContent =  userInfo.firstName + " " + userInfo.lastName;
        userCity.textContent =  userInfo.city;
        userAddress.textContent = userInfo.address;
        userEmail.textContent = userInfo.email;
    }  
}

function showProductInfo() {
    let localstorageProducts = localStorage.getItem('cartProducts');
    if (localstorageProducts) {
        localstorageProducts = JSON.parse(localStorage.getItem("cartProducts"));
        let total = 0;

        for (let i = 0; i < localstorageProducts.length; i++) {
            let productRow = document.createElement('tr');

            let productName = document.createElement('td');
            productName.textContent = localstorageProducts[i].name;

            let productType = document.createElement('td');
            productType.textContent = localstorageProducts[i].lenses;

            let productUnitPrice = document.createElement('td');
            productUnitPrice.textContent = '$' + localstorageProducts[i].price / 100;

            let productQuantity = document.createElement('td');
            productQuantity.textContent = localstorageProducts[i].inCart;

            let productLinePrice = document.createElement('td');
            productLinePrice.textContent = '$' + (localstorageProducts[i].price / 100) * localstorageProducts[i].inCart;

            let productTotalRow = document.createElement('tr');

            let producTotal = document.createElement('td');
            total +=  (localstorageProducts[i].price / 100) * localstorageProducts[i].inCart;
            producTotal.textContent = 'Total Amount:$ ' + total;


            productRow.appendChild(productName); 
            productRow.appendChild(productType);
            productRow.appendChild(productUnitPrice);
            productRow.appendChild(productQuantity);
            productRow.appendChild(productLinePrice);
            productInfoTableBody.appendChild(productRow);
            
            productTotalRow.appendChild(producTotal);
            productInfoTableFoot.appendChild(productTotalRow);
        }
    }
}

function showOrderId () {
    let localStorageOrderId = localStorage.getItem('orderId');
    if (localStorageOrderId) {
        orderId.textContent += localStorageOrderId;
    }
}

function clearLocalStorage () {
    localStorage.clear();   
}
    
showUserInfo();
showProductInfo();
showOrderId();
clearLocalStorage();
   

//window.addEventListener("beforeunload", () => localStorage.clear());
