
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('item_inventory', function(table) {
      table.increments('id').primary();
      table.string('item_title');
      table.string('item_desc');
      table.string('item_img');
      table.integer('item_price');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('order_history', function(table) {
      table.increments('id').primary();
      table.string('item_title');
      table.integer('item_price');

      table.timestamps(true, true);
    })
  ])
};


exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('order_history'),
    knex.schema.dropTable('item_inventory')
  ]);
};
