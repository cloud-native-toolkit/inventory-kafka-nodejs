<h1 align="center"> Inventory Service Kafka Producer </h1>

This Node.JS Application is part of the Inventory Service for the IBM Cloud Native Toolkit Journey. This application allows users to produce a message to a kafka topic notifying all consumers that an update to an item in inventory has occured.


<h2 align="Left">
Environment Setup
</h2>

<details>
  <summary><span style="font-size:2em">Strimzi</span></summary>

  
  ### Operator Setup

</details>

<details>
  <summary><span style="font-size:2em">Confluent</span></summary>
  
  ### Operator Setup

</details>

<details>
  <summary>Local Kafka</summary>
  
  Make sure you have an instance of kafka running either locally or remotely.

Following the instruction [here](https://kafka.apache.org/quickstart) for running kafka locally.

</details>

<h2 align="Left">
Kafka Configuration
</h2>

Modify the [Kafka Configuration Code](./src/config/kafkaConnection) to match your Kafka configuration in order for your application to properly communicate with your Kafka instance.

<h2 align="Left">
Local Development
</h2>

To start the server run:

```bash
npm run dev
```

Access the swagger page via `http:localhost:3000`

<h2 align="Left">
OpenShift Deployment
</h2>

Deploying to Openshift...

<h2 align="Left">
Contributors
</h2>

- Bryan Kribbs (bakribbs@us.ibm.com)
