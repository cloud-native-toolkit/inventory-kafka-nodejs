require('dotenv').config()
const { Kafka } = require('kafkajs');
const opts = require('../env/kafkaConfig');

console.log('OPTS', opts, '\n');
var topic = opts.topic;

const kafka = new Kafka(opts)
const admin = kafka.admin()

listTopics().then(topics => {
    if(topics.indexOf(topic) != 1) {
        console.log('Topic Does Not Exist');
        createTopics().then(created => {
            console.log('Created New Topic');
            listTopics().then(topics => {
                console.log('New Topics List: ', topics)
            });
        });
    }
}) 

async function listTopics(){
    console.log('ListTopics Admin Connecting');
    await admin.connect()
    console.log('ListTopics Admin Connected');
    var currentTopics = await admin.listTopics()
    return currentTopics;
}

async function createTopics(){
    console.log('Topic ', topic);
    try{
        var createdTopic = await admin.createTopics({
            topics: [{"topic": topic}],
        })
        console.log('Topic Created: ', createdTopic);
    } catch(e){
        console.log('Topic Creation Error: ', e);
    }
    await admin.disconnect()
}

