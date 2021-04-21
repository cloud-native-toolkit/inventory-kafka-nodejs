const { Kafka } = require('kafkajs');
var opts = {};
var services;
//FILL IN CONFIG FROM SAMPLE
if (process.env.MESSAGE_CONFIG) {
  console.log("Using VCAP_SERVICES to find credentials.");
  
  services = JSON.parse(process.env.MESSAGE_CONFIG);
  console.log(services);
  if (services.hasOwnProperty('instance_id')) {
    opts.brokers = services.kafka_brokers_sasl;
    opts.api_key = services.api_key;
  } else {
    for (var key in services) {
      if (key.lastIndexOf('messagehub', 0) === 0) {
          eventStreamsService = services[key][0];
          opts.brokers = eventStreamsService.credentials.kafka_brokers_sasl;
          opts.api_key = eventStreamsService.credentials.api_key;
          }
      }
  }
    opts.calocation = '/etc/ssl/certs';

} else {
  console.log('Using Local Config');
  var messengerConfig = require('../config/eventStreams');
  opts = messengerConfig;
}

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
  try{
    console.log('Trying to Connect');
    await producer.connect()
    console.log('producer connected');
  } catch(e) {
    console.log('E VALUE', JSON.stringify(e));
    console.log(e.name);
    if(e.name == 'KafkaJSConnectionError'){
      const err = new Error('Cannot Connect to Broker');
      throw err;
    }else {
      const err = new Error('Other Error');
      throw err;
    }
  }
  try {
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
      const err = new Error('Error Producing Message');
      throw err;
    }else {
      const err = new Error('Other Error');
      throw err;
    }
  }
}

exports.runProducer = runProducer