const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3001);

app.get('/', (request, response) => {
  response.sendfile('index.html');
});

app.get('/api/v1/inventory', (request, response) => {
  database('item_inventory').select()
    .then((items) => {
      response.status(200).json(items);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/inventory/:id', (request, response) => {
  const { id } = request.params;

  database('item_inventory').where('id', id).select()
    .then((item) => {
      if (item.length == 0) {
        return response.status(404).json({
          error: `Could not find item with id ${id}`
        });
      } else return response.status(200).json(item);
    })
    .catch((error) => {
      response.status(500).json(error);
    });
});

app.post('/api/v1/inventory', (request, response) => {
  const item = request.body;

  for (let requiredParameter of ['item_title', 'item_desc', 'item_img', 'item_price']) {
    if (!item[requiredParameter]) {
      return response
      .status(422)
      .send({ error: `Expected format: { item_title: <String>, item_desc: <Integer>, item_img: <String>, item_price: <Integer>}. You're missing a '${requiredParameter}' property.` });
    }
  }

  database('item_inventory').insert(item, 'id')
  .then(item => {
    response.status(201).json({ id: item[0] });
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/orders', (request, response) => {
  database('order_history').select()
    .then((orders) => {
      response.status(200).json(orders);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/orders', (request, response) => {
  const order = request.body;

  for (let requiredParameter of ['item_title', 'item_price']) {
    if (!order[requiredParameter]) {
      return response
      .status(422)
      .send({ error: `Expected format: { item_title: <String>, item_price: <Integer>}. You're missing a '${requiredParameter}' property.` });
    }
  }

  database('order_history').insert(order, 'id')
  .then(order => {
    response.status(201).json({ id: order[0] });
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

//the admin should be able to delete an inventory item
app.delete('/api/v1/inventory/:id', (request, response) => {
  const { id } = request.params;

  database('item_inventory').where({ id }).del()
    .then(item => {
      if (item) {
        return response.status(202).json(`Item ${id} was deleted from database`);
      } else return response.status(422).json({ error: 'Not Found' });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//not sure that we need it, but now a user can remove their order history
app.delete('/api/v1/orders/:id', (request, response) => {
  const { id } = request.params;

  database('order_history').where({ id }).del()
    .then(order => {
      if (order) {
        return response.status(202).json(`Order ${id} was deleted from database`);
      } else return response.status(422).json({ error: 'Not Found' });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`Amazon Bay Inventory API is running on ${app.get('port')}.`);
});

module.exports = app;
