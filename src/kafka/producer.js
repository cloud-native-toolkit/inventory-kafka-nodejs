const { Kafka } = require('kafkajs')
const config = require('../config/kafkaConnection')
// 1.Instantiating kafka
const kafka = new Kafka(config)
// 2.Creating Kafka Producer
const producer = kafka.producer()

async function runProducer (input) {
  console.log('RUN PRODUCER', input);
  const message = input
  await producer.connect()
await producer.send({
    topic: 'test-topic',
    messages: [
        { key: 'update1', value: input.toString() }
    ],
})
  console.log('Message Produced')
  await producer.disconnect()
}

module.exports = runProducer