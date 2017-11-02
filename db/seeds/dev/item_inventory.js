
exports.seed = function(knex, Promise) {
  return knex('order_history').del()
    .then(() => knex('item_inventory').del())
    .then(() => {
      return Promise.all([

        knex('item_inventory').insert([
          {
            item_title: 'Bending Unit',
            item_desc: 'Bending units are robots built by Moms Friendly Robot Company for the main purpose of bending metal for constructive purposes.',
            item_img: 'https://theinfosphere.org/images/0/08/Bending_School.png',
            item_price: 5000.00
          },
          {
            item_title: 'Bender Water Color Art',
            item_desc: 'Original contemporary watercolor art by Dignovel Studios, A simple idea to create a vivid, welcoming and inspirational environment around the house.',
            item_img: 'https://images-na.ssl-images-amazon.com/images/I/71VPeRxLF6L._SX522_.jpg',
            item_price: 19.00
          },
          {
            item_title: 'Bender Action Figure',
            item_desc: 'FUNK POP: Futurama Bender Action Figure',
            item_img: 'https://images-na.ssl-images-amazon.com/images/I/51fEOggwsxL._SL1000_.jpg',
            item_price: 11.00
          },
          {
            item_title: 'The Geeks Guide to World Domination: Be Afraid, Beautiful People',
            item_desc: 'Sorry, beautiful people. These days, from government to business to technology to Hollywood, geeks rule the world.',
            item_img: 'https://images-na.ssl-images-amazon.com/images/I/41jH1HvljAL._SY344_BO1,204,203,200_.jpg',
            item_price: 9.00
          }], 'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
};
