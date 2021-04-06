const { Kafka } = require('kafkajs');
const kafkaConnection = require('../config/kafkaConnection');

const kafka = new Kafka(kafkaConnection.config)
const producer = kafka.producer()

async function runProducer (input, sourceURL) {
  console.log('RUN PRODUCER INPUT', input);
  const type = "inventory.stock";
  const source = sourceURL
  const headers = { "ce_specversion": "1.0",
    "ce_type": type,
    "ce_source": source,
    "ce_id": input.id.toString(),
    "ce_time": new Date().toISOString(),
    "content-type": "application/json" };
  try {
    await producer.connect()
    console.log('producer connected');
    await producer.send({
      topic: kafkaConnection.config.kafka_topic,
      messages: [
          { headers: headers , value: input.toString() }
      ],
    })
    console.log('Message Produced');
    await producer.disconnect()
  } catch(e) {
    console.log('E VALUE', JSON.stringify(e));
    console.log(e.originalError.name);
    if(e.originalError.name == 'KafkaJSConnectionError'){
      const err = new Error('Cannot Connect to Broker');
      throw err;
    }else {
      const err = new Error('Other Error');
      throw err;
    }
  }
}

exports.runProducer = runProducer