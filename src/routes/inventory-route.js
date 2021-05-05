const { json } = require('body-parser');
const runProducer = require('../kafka/producer');
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
    if(req.body.hasOwnProperty('manufacturer') == false){
      res.status(400).send('ERROR: Missing the Manufacturer Parameter');
      return;
    }
    const messageOrigin = req.headers.host + req.url;
    console.log('Parameters Set');
    console.log('MESSAGE', messageOrigin);
    try{
      await runProducer.runProducer(req.body, messageOrigin);
      res.send('Inventory Update Published' + '\n' + JSON.stringify(req.body));
    } catch(error) {
      console.error('In Route ' + error + '\n');
      console.log('ERROR Type', typeof(error));
      var jerror = JSON.parse(error);
      console.log(jerror.place);
      if(error.place =='Error: Cannot Connect to Broker') {
        res.status(504).send('Unable to Connect to Messaging System.'); 
      } else if (error.place =='ProducingMessage') {
        if(error.cause == 'UNKNOWN_TOPIC_OR_PARTITION'){
          res.status(502).send('Topic no created or available.');
        }
      } else {
        res.status(502).send('Error');
      }
    }
  } catch (error) {
    res.status(501).json(error);
  }
})
  };

