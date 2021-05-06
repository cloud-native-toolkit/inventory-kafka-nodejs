require('dotenv').config()
const path = require('path')
const fs = require('fs')
var config = require('../env/clusterDev');
const { Kafka } = require('kafkajs');
const pemPath = path.join(__dirname, '../', '/env/kafka-key/tls.key');
console.log('PEM PATH', pemPath);
var opts = {}

