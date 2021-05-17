<h1 align="center"> Inventory Service Kafka Producer </h1>

This Node.JS Application is part of the Inventory Service for the IBM Cloud Native Toolkit Journey. This application allows users to produce a message to a kafka topic notifying all consumers that an update to an item in inventory has occured.

<h2 align="Left">
Confluent Setup
</h2>

Use the following walkthrough to setup a confluent kafka environment on OpenShift and configuring this client to use it.

<details>
  <summary><span style="font-size:18px">Operator Setup</span></summary>
  
  Follow the Instructions at the following link to setup [Confluent](https://github.ibm.com/ben-cornwell/confluent-operator) on OpenShift.

  Be sure to record the `global.sasl.plain.username` and `global.sasl.plain.password` from the `values` file in the `confluent-operator` directory for the `Secret Creation` step below.

  Once the operator has finished installing, copy the `confluentCA.key` and `confluentCA.pem` and move it to a convient location for you to access. Both will be needed for the `Secret Creation` step as well.

</details>

<details>
  <summary><span style="font-size:18px">Secret Creation</span></summary>

  Secrets will be needed in order to connect your Kafka Client to the running instance of Kafka. **Two** secrets will need to be created.

  First will be named `confluent-kafka-cert`. Use the following command to create the secret:

  ```bash
  oc create secret tls confluent-kafka-cert --cert='./~PATH TO PEM~/confluentCA.pem' --key='./~PATH TO KEY~/confluentCA.key' -n NAMESPACE
  ```

  *Replace the `PATH TO` with the proper directory path to the file and `NAMESPACE` with the namespace you want it to be deployed.*

  The second key to create will be named `kafka-operator-key`. Use the following command to create the secret:

  ```bash
  oc create secret generic kafka-operator-key --from-literal=username=GLOBAL.SASL.PLAIN.USERNAME --from-literal=password=GLOBAL.SASL.PLAIN.PASSWORD -n NAMESPACE
  ```

  *Replace the `GLOBAL.SASL.PLAIN.*` with the value from the previous step and `NAMESPACE` with the namespace you want it to be deployed.*

</details>

<details>
  <summary><span style="font-size:18px">Client Configuration</span></summary>
  
  First we need to setup the `clusterDev` configuration for the new deployed services.

  Open the file `/src/env/clusterDev.js`. **Modify** the following capitalized parameters to match your deployment.

  ```javascript
    kafka: {
        TOPIC: 'YOUR TOPIC',
        BROKERS: ['kafka.NAMESPACE.svc:9071'],
        GROUPID: 'GROUPID',
        CLIENTID: 'CLIENTID',
        SASLMECH:'plain',
        CONNECTIONTIMEOUT: 3000,
        AUTHENTICATIONTIMEOUT: 1000,
        REAUTHENTICATIONTHRESHOLD: 10000,
        RETRIES: 3,
        MAXRETRYTIME: 5
      }
  ```

  Check out the [documentation](https://kafka.js.org/docs/configuration) for details about the other parameters.

</details>

<h2 align="Left">
Local Setup
</h2>

<details>
  <summary><span style="font-size:18px">Kafka Setup</span></summary>

  Make sure you have an instance of kafka running either locally or remotely.

  Following the instruction [here](https://kafka.apache.org/quickstart) for running kafka locally.

</details>

<details>
  <summary><span style="font-size:18px">Local Client Configuration</span></summary>

  First we need to setup the `localDev` configuration for the new deployed services.

  Open the file `/src/env/localDev.js`. **Modify** the following capitalized parameters to match your deployment.

  ```javascript
    kafka: {
        TOPIC: 'YOUR TOPIC',
        BROKERS: ['localhost:9092'],
        GROUPID: 'GROUPID',
        CLIENTID: 'CLIENTID',
        CONNECTIONTIMEOUT: 3000,
        AUTHENTICATIONTIMEOUT: 1000,
        REAUTHENTICATIONTHRESHOLD: 10000,
        RETRIES: 3,
        MAXRETRYTIME: 5
      }
  ```

</details>

<details>
  <summary><span style="font-size:18px">Setting Up the Client</span></summary>
  \
  Install the dependencies

  ```bash
  npm install
  ```

  To start the server run:

  ```bash
  npm run dev
  ```

  Access the swagger page via http:localhost:3000

</details>

<h2 align="Left">
Strimzi Setup
</h2>

<details>
  <summary><span style="font-size:18px">Coming Soon...</span></summary>

</details>

<h2 align="Left">
Contributors
</h2>

- Bryan Kribbs (bakribbs@us.ibm.com)
