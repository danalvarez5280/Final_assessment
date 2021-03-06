const addToCart = (e) => {
  let data = e.target.dataset;
  displayOnShoppingCart(data);
  let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

  cart.push(data);
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
  tallyCartTotal();
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
      </div>`
    )
  })
};

const displayOrders = (array) => {
  if(array.length > 0){
    return array.forEach(order => {
      $('.order-history-page').append(
        `<div class="order-item">
          <h5>Item Cost:</h5>
          <p>${order.item_price}</p>
          <h5>Date Ordered:</h5>
          <p>${order.created_at}</p>
        </div>`
      )
    })
  }
};

const displayOnShoppingCart = (obj) => {
  $('.shopping-cart-items').append(
    `<div class='cart-item'>
      <h5>Item Title:</h5>
      <p class='cart-item-title'>${obj.title}</p>
      <h5>Item Price:</h5>
      <p class='cart-item-title'>${obj.price}</p>
    </div>`
  )
};

const getInventory = () => {
  fetch('/api/v1/inventory/')
  .then(data => data.json())
  .then(array => displayCards(array))
};

const getOrderHistory = () => {
  fetch('/api/v1/orders')
  .then(data => data.json())
  .then(array => displayOrders(array))
  .catch(error => { error })
};

const getShoppingCart = () => {
  let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
  if(cart.length > 0) {
    return cart.forEach(item => {
      $('.shopping-cart-items').append(
        `<div class='cart-item'>
          <h5>Item Title:</h5>
          <p class='cart-item-title'>${item.title}</p>
          <h5>Item Price:</h5>
          <p class='cart-item-title'><span class='cart-price'>${item.price}</span></p>
        </div>`
      )
    })
  }
};

const postOrder = (order) => {
  fetch('/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  })
  .then(data => data.json())
  .then(thing => console.log(thing))
  .then(thing => alert('You just made a purchase. Your credit card will now be charged. Thank you!'))
  .catch(error => { error })
};

const purchaseItems = () => {
  let cost = parseInt($('.purchase-total')[0].innerHTML);
  let cards = $('.cart-item');
  let order = {
    item_title: 'Order',
    item_price: cost
  }

  $(cards).remove();
  postOrder(order);
  clickedPurchase(order);
  tallyCartTotal();
  $('.purchase-total').text(0);
  localStorage.clear();
};


const clickedPurchase = (obj) => {
  let timeStamp = Date.now()
  $('.order-history-page').append(
    `<div class="order-item">
      <h5>Item Cost:</h5>
      <p>$ ${obj.item_price}</p>
      <h5>Date Ordered:</h5>
      <p>${timeStamp}</p>
    </div>`
  )
};

const showCart = (e) => {
  tallyCartTotal()
  let button = e.target;
  $(button).toggleClass('right-arrow');
  let hideArea = e.target.closest('.shopping-cart');
  let childArea = $(hideArea).find('.shopping-cart-page');
  $(childArea).toggleClass('hide');
};

const showHistory = (e) => {
  let button = e.target;
  let hideArea = e.target.closest('.order-history');
  let childArea = $(hideArea).find('.order-history-page');
  $(button).toggleClass('left-arrow');
  $(childArea).toggleClass('hide');
};

const tallyCartTotal = () => {
  let totalCost = 0;
  let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
  cart.forEach(item => {
    totalCost += parseInt(item.price)
  })

  $('.purchase-total').text(totalCost)
};


$(document).ready(getInventory);
$(document).ready(getShoppingCart);
$(document).ready(getOrderHistory);
$('.shopping-cart-page').on('click', '.purchase-all', purchaseItems)
$('.inventory').on('click', '.add-to-cart', addToCart);
$('.shopping-cart').on('click', '.shopping-cart-button', showCart);
$('.order-history').on('click', '.order-history-button', showHistory);
