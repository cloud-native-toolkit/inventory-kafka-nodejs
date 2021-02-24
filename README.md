<h1 align="center"> Inventory Service Kafka Producer </h1>

This Node.JS Application is part of the Inventory Service for the IBM Cloud Native Toolkit Journey. This application allows users to produce a message to a kafka topic notifying all consumers that an update to an item in inventory has occured.

### Environment Setup

Install the application dependencies by running the following:

```bash
npm install
```
#### Running Kafka

Make sure you have an instance of kafka running either locally or remotely.

Following the instruction [here](https://kafka.apache.org/quickstart) for running kafka locally.

#### Kafka Configuration

Modify the [Kafka Configuration Code](./src/config/kafkaConnection) to match your Kafka configuration in order for your application to properly communicate with your Kafka instance.
### Local Development

To start the server run:

```bash
npm run dev
```

Access the swagger page via `https:localhost:3000`

### Contributors

- Bryan Kribbs (bakribbs@us.ibm.com)
