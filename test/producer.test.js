const { KafkaJSMetadataNotLoaded } = require('kafkajs');
const producer = require('../kafka/producer');


test('Missing Stock Parameter Test', () => {
    let mockCall = {
        "id": 0,
        "name": "string",
        "price": 0,
        "manufacturer": "string"  
    }
    const runUpdate = jest.fn()
    it('async update', async () => {

    })
    expect(producer.runProducer()).toBe();
  });