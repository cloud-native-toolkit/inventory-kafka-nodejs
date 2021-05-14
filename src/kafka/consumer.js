require('dotenv').config()
const { Kafka } = require('kafkajs');
const opts = require('../env/kafkaConfig');
let messages = [];
console.log('Consumer OPTS', opts, '\n');
var topic = opts.topic;

const kafka = new Kafka(opts)
const consumer = kafka.consumer({ groupId: opts.groupId })


async function runConsumer(input, sourceURL){
    try{
        console.log('Connecting Consumer');
        await consumer.connect()
        console.log('Consumer Connected');
    } catch(e){
        console.log('E: ', JSON.stringify(e));
        var errorData = JSON.stringify('{ "name":'+ e.originalError.name + ', "kind":' + e.name + ', "cause":' + e.originalError.type + ', "place": "ProducingMessage" }');
        console.log('\n' + 'Message Producing Error', errorData + '\n');
        if(e.originalError.name == 'KafkaJSProtocolError') {
          const err = new Error(errorData);
          throw err;
        } else if (e.originalError.code == 'ENOTFOUND') {
          const err = new Error(errorData);
          throw err;
        }
    }
    try{
        await consumer.subscribe({ topic: opts.topic, fromBeginning: true })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => { 
                console.log({
                    key: message.key.toString(),
                    value: message.value.toString(),
                    headers: message.headers,
                })
                messages.push("{",message.key.toString(),":" ,message.value.toString(),"}")
            },
        })
        await consumer.disconnect();
        console.log('Consumer Disconnected');
        return messages;
    } catch(e){
        console.log('E: ', JSON.stringify(e));
        var errorData = JSON.stringify('{ "name":'+ e.originalError.name + ', "kind":' + e.name + ', "cause":' + e.originalError.type + ', "place": "ProducingMessage" }');
        console.log('\n' + 'Message Producing Error', errorData + '\n');
        if(e.originalError.name == 'KafkaJSProtocolError') {
          const err = new Error(errorData);
          throw err;
        } else if (e.originalError.code == 'ENOTFOUND') {
          const err = new Error(errorData);
          throw err;
        }
    }
}

exports.runConsumer = runConsumer