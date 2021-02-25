const { Kafka } = require('kafkajs')
const config = require('../config/kafkaConnection')

const kafka = new Kafka(config)
// 2.Creating Kafka Producer
const producer = kafka.producer()

async function runProducer (input, sourceURL) {
  console.log('RUN PRODUCER INPUT', input);
  const message = input
  const type = "inventory.stock";
  const source = sourceURL
  const headers = { "ce_specversion": "1.0",
    "ce_type": type,
    "ce_source": source,
    "ce_id": input.id.toString(),
    "ce_time": new Date().toISOString(),
    "content-type": "application/json" };
  await producer.connect()
  await producer.send({
      topic: config.kafka_topic,
      messages: [
          { headers: headers , value: input.toString() }
      ],
  })
  console.log('Message Produced')
  await producer.disconnect()
}

module.exports = runProducer