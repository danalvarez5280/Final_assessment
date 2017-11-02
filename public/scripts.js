const addToCart = (e) => {
  let data = e.target.dataset;
  let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

  cart.push(data);
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
};

const displayCards = (array) => {
  return array.forEach(item => {
    $('.inventory').append(
    `<div class='inventory-card'>
      <img class='inventory-img' src=${item.item_img} />
      <div class='inventory-info'>
        <h4 class='item-title' >${item.item_title}</h4>
        <p class='item-desc'>${item.item_desc}</p>
        <p class='item-price'>$ ${item.item_price}</p>
      </div>
      <div class='add-to-cart' data-id=${item.id} data-title='${item.item_title}' data-price='${item.item_price}'>
        add to cart
      <div>
    </div>`)
  })
};

const getInventory = () => {
  fetch('http://localhost:3001/api/v1/inventory/')
  .then(data => data.json())
  .then(array => displayCards(array))
};

const getShoppingCart = () => {
  let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
  if(cart.length > 0) {
    return cart.forEach(item => {
      $('.shopping-cart-page').append(
      `<div class='cart-item'>
        <h5>Item Title:</h5>
        <p class='cart-item-title'>${item.title}</p>
        <h5>Item Price:</h5>
        <p class='cart-item-title'>$ ${item.price}</p>
      </div>`)
    })
  }
};

const showCart = (e) => {
  let hideArea = e.target.closest('.shopping-cart');
  let childArea = $(hideArea).find('.shopping-cart-page');
  $(childArea).toggleClass('hide');
};

const showHistory = (e) => {
  let hideArea = e.target.closest('.order-history');
  let childArea = $(hideArea).find('.order-history-page');
  $(childArea).toggleClass('hide');
};


$(document).ready(getInventory);
$(document).ready(getShoppingCart);
$('.inventory').on('click', '.add-to-cart', addToCart);
$('.shopping-cart').on('click', '.shopping-cart-button', showCart);
$('.order-history').on('click', '.order-history-button', showHistory);
