const config = require('../env/config');
const { Kafka } = require('kafkajs');
const fs = require('fs')
var pemPath = path.join(__dirname, '../', '/env/kafka-key/tls.key');
console.log('PEM PATH', pemPath);


var opts = {
    clientId: config.kafka.CLIENTID,
    brokers: config.kafka.BROKERS,
    authenticationTimeout: 100000,
    connectionTimeout: 4000,
    reauthenticationThreshold: 10000,
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
      "retries": 3,
      "maxRetryTime": 5
   }
  }
console.log('OPTS', opts, '\n');
var topic = config.kafka.TOPIC;

const kafka = new Kafka(opts)
const admin = kafka.admin()

listTopics().then(topics => {
    console.log(topics),
    console.log(topics.indexOf("test"))
    if(topics.indexOf("test") != 1) {
        console.log('Topic Does Not Exist');
        createTopics().then(created => {
            console.log('New Topic');
            listTopics().then(topics => {
                console.log('New Topics List',topics)
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

