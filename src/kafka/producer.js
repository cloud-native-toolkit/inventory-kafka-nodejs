const { Kafka } = require('kafkajs');
const kafkaConnection = require('../config/kafkaLocalDefaults');
const envConfig = require('dotenv').config();
//IF STATEMENT TO SET CONFIG

const messengerConfig = kafkaConnection;
const kafka = new Kafka(messengerConfig)
const producer = kafka.producer()

async function runProducer (input, sourceURL) {
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
    console.log(messengerConfig.kafka_topic);
    await producer.send({
      topic: messengerConfig.kafka_topic,
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