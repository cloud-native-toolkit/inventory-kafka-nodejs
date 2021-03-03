import express from 'express'
const app = express()
app.use(express.json());
const port = process.env.PORT || 3000
import runProducer from './src/kafka/producer.js'

import swaggerUi  from 'swagger-ui-express';
//const swaggerDocument = require('./swagger.json')
import swaggerJsdoc from 'swagger-jsdoc';
const swaggerDefinition = {
  "info": {
    "title": "Inventory Service with Kafka",
    "description": "API for updating the Inventory Service.",
    "version": "1.0.0"
  },
    host: `localhost:${port}`, // Host (optional)
    basePath: '/', // Base path (optional)
  };
  // Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
  apis: ['./server.js']
};
const swaggerSpec = await swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', function (req, res) {
  res.redirect('/api-docs')
})

/**
 * @swagger
 * definitions:
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
   * /api/healthcheck:
   *   get:
   *     description: Returns a Response for the HealthCheck
   *     responses:
   *       200:
   *         description: OK
   */

app.get('/api/healthcheck', function (req, res) {
  console.log('HC');
  const healthcheck = {
		uptime: process.uptime(),
		message: 'OK',
		timestamp: Date.now()
	};
	try {
		res.send(healthcheck);
	} catch (e) {
		healthcheck.message = e;
		res.status(503).send();
	}
})

/**
   * @swagger
   * /inventory/update:
   *   post:
   *     summary: Updates the Inventory using Kafka and CloudEvents
   *     requestBody:
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/definitions/Item'
   *     responses:
   *       200:
   *         description: Inventory Updated
   *       501:
   *         description: Error with Request
   *     tags:
   *      - Inventory Actions
   */


app.post("/inventory/update", (req, res) => {
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
    runProducer(req.body, messageOrigin);
    res.send('Inventory Update Sent')
  } catch (error) {
    res.status(500).json(error);
  }
})

const server = app.listen(port, () => {
  console.log('Example app listening at http://localhost:%s', port);
})
