require('dotenv').config()
const { Kafka } = require('kafkajs');
const opts = require('../env/kafkaConfig');


console.log('OPTS', opts);
var topic = opts.topic;
const kafka = new Kafka(opts)
const producer = kafka.producer()

async function runProducer (input, sourceURL) {
  console.log('IN PRODUCER');
  const type = "inventory.stock";
  const source = sourceURL
  const headers = { "ce_specversion": "1.0",
    "ce_type": type,
    "ce_source": source,
    "ce_id": input.id.toString(),
    "ce_time": new Date().toISOString(),
    "content-type": "application/json" };

// Connecting to the Broker Block
  try {
    console.log('Trying to Connect');
    await producer.connect()
    console.log('Producer Connected');
  } catch(e) {
      console.error('Connection Error', JSON.stringify(e));
      console.log(e.name);
      if(e.name == 'KafkaJSConnectionError'){
        const err = new Error('Cannot Connect to Broker');
        throw err;
      } else {
        const err = new Error('Other Error');
        throw err;
      }
  }

// Producing the Message Block
  try {
    console.log('Producing Message');
    await producer.send({
      topic: topic,
      messages: [
          { headers: headers , value: input.toString() }
      ],
      acks: 1
    })
    console.log('Message Produced');
    await producer.disconnect()
  } catch(e) {
    console.log('E: ', JSON.stringify(e));
    var errorData = JSON.stringify('{ "name":'+ e.originalError.name + ', "kind":' + e.name + ', "cause":' + e.originalError.type + ', "place": "ProducingMessage" }');
    console.log('\n' + 'Message Producing Error', errorData + '\n');
    if(e.originalError.name == 'KafkaJSProtocolError') {
      const err = new Error(errorData);
      throw err;
    } else {
      const err = new Error('Other Error');
      throw err;
    }
  }
}

exports.runProducer = runProducer