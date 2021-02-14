const { Kafka } = require('kafkajs');
const config = require('../config/kafkaConnection');
// 1.Instantiating kafka
const kafka = new Kafka(config);
// 2.Creating Kafka Producer
const producer = kafka.producer();
async function runProducer() {
    const message = {
        nTransOrderID: 1000,
        sTransOrderCode: "TO-101212"
    }
// 3.Connecting producer to kafka broker.
await producer.connect()
await producer.send({
    topic: 'test-topic',
    messages:
        [{ value: JSON.stringify(message) }],
    })
console.log('Message Produced');
await producer.disconnect()
}

console.log('Sending Messages');
runProducer();

module.exports = runProducer;