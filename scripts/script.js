const notificationBar = document.querySelector('.notification');
const cartButton = document.querySelector('.cart-button');
const cart = document.querySelector('.cart');
const cartTotalPrice = document.querySelector('.cart-footer .price');
const progressBarContainers = document.querySelectorAll('.progressbar-container');
const progressBars = document.querySelectorAll('.progressbar');
const products = document.querySelectorAll('.product');
let itemsAlreadyInCart = JSON.parse(localStorage.getItem('cart')) || [];

let tempPrice = 0;
for (let i = 0; i < itemsAlreadyInCart.length; i++) {
    DOMCreateCartElement(itemsAlreadyInCart[i]);
    tempPrice += backToInt(itemsAlreadyInCart[i]['productPrice']);
}
cartTotalPrice.textContent = readablePrice(tempPrice);

if (!itemsAlreadyInCart.length) cart.querySelector('.cart-message').classList.remove('closed');


function replaceSubstrAt(string, index, replacement) {
    return string.slice(0, index) + replacement + string.slice(index);
}

sessionStorage.getItem("notification-hidden") ? notificationBar.classList.add('notification-hidden') : console.log();

document.querySelector('.close').onclick = () => {
    notificationBar.classList.add('notification-hidden');
    notificationBar.setAttribute('aria-hidden', 'true');
    sessionStorage.setItem("notification-hidden", true);
};

function readablePrice(price) {
    return '₦' + Number(price).toLocaleString();
}
function backToInt(price) {
    return typeof price == 'string' ? Number(price.slice(1).split(',').join('')) : price;
}

for (let price of document.querySelectorAll('main .price')) {
    price.textContent = readablePrice(price.textContent);
}

cart.style.setProperty('top', `${(cartButton.getBoundingClientRect().bottom + 10) - notificationBar.offsetHeight}px`);
cart.style.setProperty('right', `${window.innerWidth - cartButton.getBoundingClientRect().right - 5}px`);

cartButton.onclick = (event) => {
    cart.classList.toggle('closed');
    event.stopPropagation();
};
document.querySelector('body').onclick = (event) => {
    if (!(event.target == cart || Array.from(cart.querySelectorAll('*')).includes(event.target))) cart.classList.add('closed');
};

for (let i = 0; i < progressBars.length; i++) {
    let progressBarVal = progressBars[i].getAttribute('aria-valuenow');
    progressBarContainers[i].style.setProperty('--width', `${(progressBarVal / 100) * progressBars[i].clientWidth}px`);
    if (progressBarVal >= 60) progressBarContainers[i].style.setProperty('--backgroundColor', 'green');
    else if (progressBarVal <= 20) progressBarContainers[i].style.setProperty('--backgroundColor', 'red');
    else progressBarContainers[i].style.setProperty('--backgroundColor', 'orange');
}

for (let product of products) {
    if (Boolean(localStorage.getItem('cart')) && JSON.parse(localStorage.getItem('cart')).some((obj) => {
        return obj.productId == product.getAttribute('data-product-id');
    })) {
        product.lastElementChild.textContent = "Added to cart";
        product.lastElementChild.classList.add('disabled');
    }
}

function addObjectToLocalStorage(item, obj) {
    let itemInLocalStorage = localStorage.getItem(item) ? localStorage.getItem(item) : '[]';
    JSON.parse(itemInLocalStorage).length ?
        localStorage.setItem('cart', replaceSubstrAt(itemInLocalStorage, itemInLocalStorage.length - 1, ', ' + JSON.stringify(obj))) :
        localStorage.setItem('cart', JSON.stringify([obj]));
}

function addToCart(addToCartButton) {
    if (!addToCartButton.classList.contains('disabled')) {
        addToCartButton.textContent = "Added to cart";
        addToCartButton.classList.add('disabled');
        addToCartButton.setAttribute('disabled', 'true');
        let product =
        {
            'productId': addToCartButton.parentElement.getAttribute('data-product-id'),
            'productName': addToCartButton.parentElement.querySelector('.product-name').textContent,
            'productImgSrc': addToCartButton.parentElement.querySelector('.product-image').getAttribute('src'),
            'productPrice': addToCartButton.parentElement.querySelector('.product-discount-price').textContent,
            'productQtyAvailable': addToCartButton.parentElement.querySelector('.num-qty-available').textContent,
            'productQty': 1
        }
        addObjectToLocalStorage('cart', product);
        DOMCreateCartElement(product);
        cartTotalPrice.textContent = readablePrice(backToInt(cartTotalPrice.textContent) + backToInt(product['productPrice']));
    }
}

function removeFromCart(DOMCartItem) {
    setTimeout(() => {
        let productId = DOMCartItem.getAttribute('data-product-id'),
            currentItemsInCart = JSON.parse(localStorage.getItem('cart'));
        localStorage.setItem('cart', JSON.stringify(currentItemsInCart.filter((obj) => { return obj.productId != productId; })));
        DOMCartItem.remove();

        if (document.querySelector(`.product[data-product-id='${productId}']`)) {
            let addToCartButton = document.querySelector(`.product[data-product-id='${productId}']`).querySelector('.add-to-cart-button');
            addToCartButton.classList.remove('disabled');
            addToCartButton.disabled = false;
            addToCartButton.textContent = null;
            addToCartButton.appendChild(document.createElement('span')).setAttribute('class', 'button-text');
            addToCartButton.querySelector('.button-text').textContent = "Add to cart ";
            addToCartButton.querySelector('.button-text').appendChild(document.createElement('i')).setAttribute('class', 'fa fa-shopping-cart');
        } 
        

        if (currentItemsInCart.length <= 1) cart.querySelector('.cart-message').classList.remove('closed');
        document.querySelector('.cart-items-num').textContent = cart.querySelectorAll('.cart-item').length;
    }, 1);
}

function DOMCreateCartElement(productObject) {
    cart.querySelector('.cart-message').classList.add('closed');
    cart.appendChild(document.createElement('div')).setAttribute('class', 'cart-item');
    cart.lastChild.setAttribute('data-product-id', productObject['productId']);
    cart.lastChild.setAttribute('data-product-price', productObject['productPrice']);
    cart.lastChild.setAttribute('data-product-qty-available', productObject['productQtyAvailable']);
    cart.lastChild.appendChild(document.createElement('img')).setAttribute('class', 'cart-item-image');
    cart.lastChild.querySelector('.cart-item-image').setAttribute('src', productObject['productImgSrc']);
    cart.lastChild.appendChild(document.createElement('div')).setAttribute('class', 'cart-item-text');
    cart.lastChild.querySelector('.cart-item-text').appendChild(document.createElement('p')).setAttribute('class', 'cart-item-name');
    cart.lastChild.querySelector('.cart-item-text').appendChild(document.createElement('p')).setAttribute('class', 'cart-item-price');
    cart.lastChild.querySelector('.cart-item-name').textContent = productObject['productName'];
    cart.lastChild.querySelector('.cart-item-price').textContent = productObject['productPrice'];
    cart.lastChild.appendChild(document.createElement('div')).setAttribute('class', 'cart-control-qty');
    cart.lastChild.querySelector('.cart-control-qty').appendChild(document.createElement('button')).setAttribute('class', 'minus-button');
    cart.lastChild.querySelector('.minus-button').appendChild(document.createElement('span')).setAttribute('class', 'button-text');
    cart.lastChild.querySelector('.minus-button').querySelector('.button-text').textContent = '-';
    cart.lastChild.querySelector('.cart-control-qty').appendChild(document.createElement('input')).setAttribute('class', 'cart-control-qty-text-box');
    cart.lastChild.querySelector('.cart-control-qty-text-box').setAttribute('type', 'text');
    cart.lastChild.querySelector('.cart-control-qty-text-box').setAttribute('value', 1);
    cart.lastChild.querySelector('.cart-control-qty-text-box').setAttribute('onKeyPress', "if (this.value.length == 2) return false;");
    cart.lastChild.querySelector('.cart-control-qty').appendChild(document.createElement('button')).setAttribute('class', 'plus-button');
    cart.lastChild.querySelector('.plus-button').appendChild(document.createElement('span')).setAttribute('class', 'button-text');
    cart.lastChild.querySelector('.plus-button').querySelector('.button-text').textContent = '+';

    cart.lastChild.querySelector('.plus-button').onclick = (event) => {
        let textBox = event.currentTarget.previousSibling;
        if (Number(textBox.value) < Number(textBox.parentElement.parentElement.getAttribute('data-product-qty-available'))) {
            textBox.setAttribute('value', Number(textBox.value) + 1);
            textBox.dispatchEvent(new Event('change'));
        }
    };
    cart.lastChild.querySelector('.minus-button').onclick = (event) => {
        let textBox = event.currentTarget.nextSibling;
        if (Number(textBox.value) > 0) {
            textBox.setAttribute('value', Number(textBox.value) - 1);
            textBox.dispatchEvent(new Event('change'));
        }
    };

    cart.lastChild.querySelector('.cart-control-qty-text-box').onchange = (event) => {
        let cartItem = event.target.parentElement.parentElement;
        cartItem.querySelector('.cart-item-price').textContent = readablePrice(backToInt(cartItem.getAttribute('data-product-price')) * Number(event.target.value));
        cartTotalPrice.textContent = readablePrice(Array.from(document.querySelectorAll('.cart-item-price')).map((a) => { return a.textContent; }).reduce((a, b) => { return backToInt(a) + backToInt(b); }, '₦0'));
        if (event.target.value == '0') removeFromCart(cartItem);
    };

    document.querySelector('.cart-items-num').textContent = cart.querySelectorAll('.cart-item').length;

}