const server = require('../server');
var chai = require('chai')
var chaiHttp = require('chai-http');
var expect = require('chai').should
var expect = require('chai').expect

chai.use(chaiHttp);

describe('Endpoint Testing', function(){
  it('No Body Sent', function (done) {
    chai.request(server)
      .post('/inventory/update')
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        done();                               // <= Call done to signal callback end
      });
    })
    it('Body Missing Stock parameter', function (done) {
      chai.request(server)
        .post('/inventory/update')
        .send({
          "id": 0,
          "name": "string",
          "price": 0,
          "manufacturer": "string"
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.text).to.equal("ERROR: Missing the Stock Parameter");
          done();                               // <= Call done to signal callback end
        });
      })
  });