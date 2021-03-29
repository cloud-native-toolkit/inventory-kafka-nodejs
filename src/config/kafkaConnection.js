const config = {
clientId: 'inventory-service-client',
kafka_topic: 'test-topic',
brokers: ['localhost:9092'],
connectionTimeout: 3000,
authenticationTimeout: 1000,
reauthenticationThreshold: 10000,
};

exports.config = config