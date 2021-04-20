const { Kafka } = require('kafkajs');
const envConfig = require('dotenv').config();
const messengerConfig = require('../config/kafkaLocalDefaults');

//Setting Messaging Config
if(process.env.MESSAGE_CONFIG){
  console.log(process.env.MESSAGE_CONFIG);
  messengerConfig = process.env.MESSAGE_CONFIG;
} else {
  console.log('NO ES CONFIG USING LOCAL');
}
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