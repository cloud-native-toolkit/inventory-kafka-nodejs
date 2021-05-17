require('dotenv').config()
const { Kafka } = require('kafkajs');
const opts = require('../env/kafkaConfig');

console.log('OPTS', opts, '\n');
var topic = opts.topic;

const kafka = new Kafka(opts)
const admin = kafka.admin()

async function topicCreation(input){
    console.log('tc input', input);
    listTopics().then(topics => {
        if(topics.indexOf(input.name.toString()) != 1) {
            console.log('Topic Does Not Exist');
            createTopics(input.name.toString()).then(created => {
                console.log('Created New Topic');
                listTopics().then(topics => {
                    console.log('New Topics List: ', topics)
                });
            });
        }
    }) 
}

async function listTopics(){
    try {
        console.log('ListTopics Admin Connecting');
        await admin.connect()
        console.log('ListTopics Admin Connected');
        var currentTopics = await admin.listTopics()
        return currentTopics;
    } catch(e) {
        throw new Error(e.message);
    }
    
}

async function createTopics(topic){
    console.log('Topic ', topic);
    try{
        var createdTopic = await admin.createTopics({
            topics: [{"topic": topic}],
        })
        console.log('Topic Created: ', createdTopic);
    } catch(e){
        throw new Error(e.message);
    }
    await admin.disconnect()
}

exports.topicCreation = topicCreation