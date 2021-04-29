const { KafkaJSMetadataNotLoaded } = require('kafkajs');
const supertest = require("supertest");
// app is supposed to point to the app.js file
const producer = require('../src/kafka/producer');
const request = supertest(producer);


describe('Testing /Update Endpoint', function () {
    it('respond with valid HTTP status code and description and message', function (done) {
      // Make POST Request
      const response = async () => await request.post('/inventory/update').send({
          "id": 0,
          "name": "string",
          "stock": 0,
          "price": 0,
          "manufacturer": "string"
      });

      // Compare response with expectations
      expect(response.status).toBe(502);
      expect(response.body.status).toBe('Error: Bad Gateway');
      expect(response.body.message).toBe('Error');
      done();
    });
});

describe('Testing /Update endpoint without parameter ', function () {
  it('respond with valid HTTP status code and description and message', function (done) {
    // Make POST Request
    const response = async() => await request.post('/inventory/update').send({
      "id": 0,
      "name": "string",
      "price": 0,
      "manufacturer": "string"
    });

    // Compare response with expectations
    expect(response.status).toBe(400);
    expect(response.body.status).toBe('Error:Bad Request');
    expect(response.body.message).toBe('ERROR: Missing the Stock Parameter');
    done();
  });
});

