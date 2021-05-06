require('dotenv').config()
const { Kafka } = require('kafkajs');
const opts = require('../env/kafkaConfig');

console.log('OPTS', opts, '\n');
var topic = opts.topic;

const kafka = new Kafka(opts)
const consumer = kafka.consumer()

