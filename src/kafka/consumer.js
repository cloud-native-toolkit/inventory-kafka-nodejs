const { Kafka } = require('kafkajs');
const config = require('../config/kafkaConnection');
// 1.Instantiating kafka
const kafka = new Kafka(config);
// 2.Creating Kafka Consumer and passing group ID.
const consumer = kafka.consumer({ groupId: 'medium-group-01' });
const runConsumer = async () => {
        // 3.Connecting consumer to kafka broker.
    await consumer.connect()
// 4.Subscribing to a topic in order to receive messages/data.
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
// 5. Sending an action to be handled for each message RECEIVED.
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({ "Doing something with the message": topic, partition, message });
            },
        })
    await consumer.disconnect();
}

runConsumer();