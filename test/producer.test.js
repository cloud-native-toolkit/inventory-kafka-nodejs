const { KafkaJSMetadataNotLoaded } = require('kafkajs');
const supertest = require("supertest");
// app is supposed to point to the app.js file
const server = require('../server');
var chai = require('chai')
var chaiHttp = require('chai-http');
var expect = require('chai').should
var expect = require('chai').expect

chai.use(chaiHttp);

describe('Endpoint Testing', function(){
  it('Produce Endpoint', function (done) {
    chai.request(server)
      .post('/inventory/update')
      .end((err, res) => {
        console.log('RESPONSE', res.statusCode);
        expect(res.statusCode).to.equal(400);
        done();                               // <= Call done to signal callback end
      });
    })
  });