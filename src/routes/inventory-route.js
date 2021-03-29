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


app.post("/inventory/update", (req, res) => {
  console.log('IN UPDATE');
  try {
    if(req.body.hasOwnProperty('id') == false){
      res.status(500);
      res.send("ERROR: Missing the id Parameter");
      return;
    }
    if(req.body.hasOwnProperty('name') == false){
      res.status(500);
      res.send("ERROR: Missing the Name Parameter");
      return;
    }
    if(req.body.hasOwnProperty('price') == false){
      res.status(500);
      res.send("ERROR: Missing the Price Parameter");
      return;
    }
    if(req.body.hasOwnProperty('stock') == false){
      res.status(500);
      res.send("ERROR: Missing the Stock Parameter");
      return;
    }
    if(req.body.hasOwnProperty('manufacturer') == false){
      res.status(500);
      res.send("ERROR: Missing the Manufacturer Parameter");
      return;
    }
    const messageOrigin = req.headers.host + req.url;
    console.log('MESSAGE', messageOrigin);
    runProducer.runProducer(req.body, messageOrigin);
    res.send('Inventory Update Sent')
  } catch (error) {
    res.status(500).json(error);
  }
})
  };

