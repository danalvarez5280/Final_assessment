process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return some text from our default page', (done) => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.should.include('Amazon Bay');
        done();
      });
  });

  it('should return a 404 for a route that does not exist', (done) => {
    chai.request(server)
      .get('/futurama')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });
});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
      .then(() => {
        done();
      })
      .catch((error) => {
        console.log('Before error: ', error);
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch((error) => {
        console.log('Before each error: ', error);
      });
  });

  it('should return all 4 of the items in the inventory', (done) => {
    chai.request(server)
      .get('/api/v1/inventory')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.should.be.a('object');
        response.body.length.should.equal(4);
        done();
      });
  });

  it('should be able to return an item from the inventory by the id', (done)=> {
    chai.request(server)
      .get('/api/v1/inventory/1')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.should.be.a('object');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('item_title');
        response.body[0].item_title.should.equal('Bending Unit');
        response.body[0].should.have.property('item_desc');
        response.body[0].item_desc.should.equal('Bending units are robots built by Moms Friendly Robot Company for the main purpose of bending metal for constructive purposes.');
        response.body[0].should.have.property('item_img');
        response.body[0].item_img.should.equal('https://theinfosphere.org/images/0/08/Bending_School.png');
        response.body[0].should.have.property('item_price');
        response.body[0].item_price.should.equal(5000.00);
        done();
      });
  });

  it('should be able to add an item to the inventory', (done) =>{
    chai.request(server)
    .post('/api/v1/inventory')
    .send({
      item_title: 'Bender is Great',
      item_desc: 'Even I have to applaude the performance of me, Bender!',
      item_img: 'https://avatars2.githubusercontent.com/u/1045011?s=460&v=4',
      item_price: 1000000.00
    })
    .end((error, response) => {
      response.should.have.status(201);
      response.body.should.be.a('string');

      done();
    });
  });

  it('should return a 404 for an item id that does not exist', (done) => {
    chai.request(server)
      .get('/ap1/v1/inventory/4590001')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });

  it('should return a 404 for orders that do not exist', (done) => {
    chai.request(server)
      .get('/ap1/v1/orders/4590001')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });
});
