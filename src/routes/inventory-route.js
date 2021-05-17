const runConsumer = require('../kafka/consumer');
const runProducer = require('../kafka/producer');
const topicCreation = require('../kafka/admin');
module.exports.setup = (app) => {
/**
  * @swagger
  * components:
  *  schemas:
  *   Item:
  *     required:
  *       - id
  *       - name
  *       - stock
  *       - price
  *       - manufacturer
  *     properties:
  *       id:
  *         type: integer
  *       name:
  *         type: string
  *       stock:
  *         type: integer
  *       price:
  *         type: integer
  *         format: double
  *       manufacturer:
  *         type: string
  */

 /**
   * @swagger
   *  /inventory/update:
   *    post:
   *     summary: Updates the Inventory using Kafka and CloudEvents
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Item'
   *     responses:
   *       '200':
   *         description: Inventory Updated
   *       '501':
   *         description: Error with Request
   *     tags:
   *      - Inventory Actions
   */


app.post("/inventory/update", async(req, res) => {
  console.log('Inventory Update Called');
  try {
    if(req.body.hasOwnProperty('id') == false){
      res.status(400).send("ERROR: Missing the id Parameter");
      return;
    }
    if(req.body.hasOwnProperty('name') == false){
      res.status(400).send("ERROR: Missing the Name Parameter");
      return;
    }
    if(req.body.hasOwnProperty('price') == false){
      console.log('Missing Price');
      res.status(400).send("ERROR: Missing the Price Parameter");
      return;
    }
    if(req.body.hasOwnProperty('stock') == false){
      res.status(400).send("ERROR: Missing the Stock Parameter");
      return;
    }
    if(req.body.hasOwnProperty('manufacturer') == false) {
      res.status(400).send('ERROR: Missing the Manufacturer Parameter');
      return;
    }
    const messageOrigin = req.headers.host + req.url;
    console.log('Parameters Set');
    try{
      await runProducer.runProducer(req.body, messageOrigin);
      res.send('Inventory Update Published' + '\n' + JSON.stringify(req.body));
    } catch(error) {
      console.log(error + '\n');
      if(error.toString().includes('ECONNREFUSED')){
        res.status(504).send({
          'message': 'Connection to Broker Failed. Check to see if Broker is Running.'
        });
      } else if(error.toString().includes('getaddrinfo')) {
        res.status(504).send({
          'message': 'Connection to Broker Failed. Looks like the Broker address is incorrect in the configuration file.'
        });
      } else if(error.toString().includes('does not host this topic-partition')) {
        res.status(409).send({
          'message': 'The Topic needs to be created.'
        });
      }
    }
  } catch (error) {
    res.status(501).json(error);
  }
})

/**
  * @swagger
  * components:
  *  schemas:
  *   Topic:
  *     required:
  *       - name
  *     properties:
  *       name:
  *         type: string
  *       partitions:
  *         type: integer
  *         minimum: 1
  */

/**
   * @swagger
   *  /inventory/createTopic:
   *    post:
   *     summary: Creates a topic on the Kafka Broker
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Topic'
   *     responses:
   *       '200':
   *         description: Topic Created
   *       '400':
   *         description: Error with Request
   *       '501':
   *         description: Error Processing Request
   *     tags:
   *      - Kafka Actions
   */


app.post("/inventory/createTopic", async(req, res) => {
  console.log('Inventory Create Topic Called');
  try {
    if(req.body.hasOwnProperty('name') == false){
      res.status(400).send("ERROR: Missing the Name Parameter");
      return;
    }
    if(req.body.hasOwnProperty('partitions') == false){
      console.log('Missing partitions');
      res.status(400).send("ERROR: Missing the Price Parameter");
      return;
    }
    const messageOrigin = req.headers.host + req.url;
    console.log('Parameters Set');
    console.log('MESSAGE', messageOrigin);
    try{
      await topicCreation.topicCreation(req.body, messageOrigin);
      res.send('Topic has been Created' + '\n' + JSON.stringify(req.body));
    } catch(error) {
      console.log(error + '\n');
      if(error.toString().includes('ECONNREFUSED')){
        res.status(504).send({
          'message': 'Connection to Broker Failed. Check to see if Broker is Running.'
        });
      } else if(error.toString().includes('getaddrinfo')) {
        res.status(504).send({
          'message': 'Connection to Broker Failed. Looks like the Broker address is incorrect in the configuration file.'
        });
      } else if(error.toString().includes('does not host this topic-partition')) {
        res.status(409).send({
          'message': 'The Topic needs to be created.'
        });
      }
    }
  } catch (error) {
    res.status(501).json(error);
  }
})

/**
   * @swagger
   *  /inventory/consumeTopicMessages:
   *    post:
   *     summary: Consumes messages from specified topic.
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Topic'
   *     responses:
   *       '200':
   *         description: Topic Created
   *       '400':
   *         description: Error with Request
   *       '501':
   *         description: Error Processing Request
   *     tags:
   *      - Kafka Actions
   */


 app.post("/inventory/consumeTopicMessages", async(req, res) => {
  console.log('Inventory Consume Messages');
    try {
      if(req.body.hasOwnProperty('name') == false){
        res.status(400).send("ERROR: Missing the Topic ");
        return;
      }
      const messageOrigin = req.headers.host + req.url;
      console.log('Parameters Set');
      console.log('MESSAGE', messageOrigin);
      try {
        var messages = await runConsumer.runConsumer(req.body, messageOrigin);
        console.log('Messages', messages);
        res.send(messages).status(200);
      } catch(error) {
        console.log(error + '\n');
        if(error.toString().includes('ECONNREFUSED')){
          res.status(504).send({
            'message': 'Connection to Broker Failed. Check to see if Broker is Running.'
          });
        } else if(error.toString().includes('getaddrinfo')) {
          res.status(504).send({
            'message': 'Connection to Broker Failed. Looks like the Broker address is incorrect in the configuration file.'
          });
        } else if(error.toString().includes('does not host this topic-partition')) {
          res.status(409).send({
            'message': 'The Topic needs to be created.'
          });
        }
      } 
    } catch (error) {
      res.status(501).json(error);
    }
  })
};

