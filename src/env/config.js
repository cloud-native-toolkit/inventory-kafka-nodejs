module.exports = {
    kafka: {
      TOPIC: 'test',
      BROKERS: ['kafka.kafka.svc:9071'],
      GROUPID: 'bills-consumer-group',
      CLIENTID: 'sample-kafka-client',
      SASLJAAS: 'org.apache.kafka.common.security.plain.PlainLoginModule required username="devUser15" password="kafkaDev15";',
      SASLMECH:'plain',
      SECPROTO: 'SASL_PLAINTEXT',
      SSLLOC: '/tmp/truststore.jks',
      SSLPASS: 'password'
    }
  }