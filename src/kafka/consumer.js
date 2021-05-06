require('dotenv').config()
const { Kafka } = require('kafkajs');
const opts = require('../env/kafkaConfig');

console.log('OPTS', opts, '\n');
var topic = opts.topic;

const kafka = new Kafka(opts)
const consumer = kafka.consumer()


function consumeMessage(){
    try{
        console.log('Connecting Consumer');
        await consumer.connect()
        console.log('Consumer Connected');
    } catch(e){

    }
    try{
        await consumer.subscribe({ topic: opts.topic })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    key: message.key.toString(),
                    value: message.value.toString(),
                    headers: message.headers,
                })
            },
        })
    } catch(e){

    }
}


// It's possible to start from the beginning of the topic
await consumer.subscribe({ topic: 'topic-D', fromBeginning: true })