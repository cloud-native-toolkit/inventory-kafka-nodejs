const { response } = require('express');
const { Kafka } = require('kafkajs');
const config = require('../config/kafkaConnection.js');

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
  try{
    await producer.connect()
    console.log('producer connected');
  } catch(e) {
    const err = new Error('Cannot Connect to Broker', e);
    throw err;
  }
  try {
    await producer.send({
      topic: config.kafka_topic,
      messages: [
          { headers: headers , value: input.toString() }
      ],
  })
  console.log('Message Produced');
  res.send('Inventory Update Published');
  await producer.disconnect()
  } catch(e){
    console.error('Cannot Publish Message to Broker', e);
  }
}

exports.runProducer = runProducer