require('dotenv').config()
const path = require('path')
const fs = require('fs')
var config = require('../env/clusterDev');
const { Kafka } = require('kafkajs');
const pemPath = path.join(__dirname, '../', '/env/kafka-key/tls.key');
console.log('PEM PATH', pemPath);
var opts = {}
//Config Setup
console.log('CONF', config, '\n');
if(fs.existsSync(pemPath)){
  console.log('Using Cluster Configuration');
  var config = require('../env/clusterDev');
  opts = {
    clientId: config.kafka.CLIENTID,
    brokers: config.kafka.BROKERS,
    authenticationTimeout: config.kafka.AUTHENTICATIONTIMEOUT,
    connectionTimeout: config.kafka.CONNECTIONTIMEOUT,
    reauthenticationThreshold: config.kafka.REAUTHENTICATIONTHRESHOLD,
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync(pemPath, 'utf-8')
    },
    sasl: {
      mechanism: config.kafka.SASLMECH, // scram-sha-256 or scram-sha-512
      username: 'devUser15',
      password: 'kafkaDev15'
    },
    retry: {
      "retries": config.kafka.RETRIES,
      "maxRetryTime": config.kafka.MAXRETRYTIME
   }
  }
} else {
  console.log('Using Local Configuration');
  var config = require('../env/localDev');
  opts = {
    clientId: config.kafka.CLIENTID,
    brokers: config.kafka.BROKERS,
    authenticationTimeout: config.kafka.AUTHENTICATIONTIMEOUT,
    connectionTimeout: config.kafka.CONNECTIONTIMEOUT,
    reauthenticationThreshold: config.kafka.REAUTHENTICATIONTHRESHOLD,
    retry: {
      "retries": config.kafka.RETRIES,
      "maxRetryTime": config.kafka.MAXRETRYTIME
   }
  }

}

console.log('OPTS', opts, '\n');
var topic = config.kafka.TOPIC;
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