module.exports = {
   kafka: {
      TOPIC: 'test',
      BROKERS: ['localhost:9092'],
      GROUPID: 'bills-consumer-group',
      CLIENTID: 'inventory-service-client',
      CONNECTIONTIMEOUT: 3000,
      AUTHENTICATIONTIMEOUT: 1000,
      REAUTHENTICATIONTHRESHOLD: 10000,
      RETRIES: 3,
      MAXRETRYTIME: 5
    }
}