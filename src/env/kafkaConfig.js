require('dotenv').config()
const path = require('path')
const fs = require('fs')
const pemPath = path.join(__dirname, '../', '/env/kafka-key/tls.key');
const stinziPath = path.join(__dirname, '../', '/env/kafka-key/tls.key');
const usernameKeyPath = path.join(__dirname, '../', '/env/kafka-operator-key/username');
const passKeyPath = path.join(__dirname, '../', '/env/kafka-operator-key/password');


function setConfig(){
    if(fs.existsSync(pemPath)){
        console.log('Using Confluent Configuration');
        var config = require('./clusterDev');
        opts = {
          topic: config.kafka.TOPIC,
          groupId: config.kafka.GROUPID,
          clientId: config.kafka.CLIENTID,
          brokers: config.kafka.BROKERS,
          authenticationTimeout: config.kafka.AUTHENTICATIONTIMEOUT,
          connectionTimeout: config.kafka.CONNECTIONTIMEOUT,
          reauthenticationThreshold: config.kafka.REAUTHENTICATIONTHRESHOLD,
          ssl: {
            rejectUnauthorized: false,
            ca: fs.readFileSync(pemPath, 'utf-8')
          },
          sasl: {
            mechanism: config.kafka.SASLMECH, // scram-sha-256 or scram-sha-512
            username: fs.readFileSync(usernameKeyPath, 'utf-8'),
            password: fs.readFileSync(passKeyPath, 'utf-8')
          },
          retry: {
            "retries": config.kafka.RETRIES,
            "maxRetryTime": config.kafka.MAXRETRYTIME
         }
        }
      } else if(fs.existsSync()) {
        console.log('Using Strimzi Configuration');
        var config = require('./clusterDev');
        opts = {
          topic: config.kafka.TOPIC,
          groupId: config.kafka.GROUPID,
          clientId: config.kafka.CLIENTID,
          brokers: config.kafka.BROKERS,
          authenticationTimeout: config.kafka.AUTHENTICATIONTIMEOUT,
          connectionTimeout: config.kafka.CONNECTIONTIMEOUT,
          reauthenticationThreshold: config.kafka.REAUTHENTICATIONTHRESHOLD,
          ssl: {
            rejectUnauthorized: false,
            ca: fs.readFileSync(pemPath, 'utf-8')
          },
          sasl: {
            mechanism: config.kafka.SASLMECH, // scram-sha-256 or scram-sha-512
            username: fs.readFileSync(usernameKeyPath, 'utf-8'),
            password: fs.readFileSync(passKeyPath, 'utf-8')
          },
          retry: {
            "retries": config.kafka.RETRIES,
            "maxRetryTime": config.kafka.MAXRETRYTIME
         }
        }
    
      } else {
        console.log('Using Local Configuration');
        var config = require('./localDev');
        opts = {
          topic: config.kafka.TOPIC,
          clientId: config.kafka.CLIENTID,
          brokers: config.kafka.BROKERS,
          authenticationTimeout: config.kafka.AUTHENTICATIONTIMEOUT,
          connectionTimeout: config.kafka.CONNECTIONTIMEOUT,
          reauthenticationThreshold: config.kafka.REAUTHENTICATIONTHRESHOLD,
          retry: {
            "retries": config.kafka.RETRIES,
            "maxRetryTime": config.kafka.MAXRETRYTIME
         }
        }
      }
}

setConfig();

module.exports = opts