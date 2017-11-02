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

const getInventory = () => {
  fetch('http://localhost:3001/api/v1/inventory/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(data => data.json())
  .then(thing => console.log('thing', thing))
};


$('.shopping-cart').on('click', '.shopping-cart-button', showCart);
$('.order-history').on('click', '.order-history-button', showHistory);
$(document).ready(getInventory);
