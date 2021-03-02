const express = require('express')
const app = express()
const port = 3000
const kafkaFunctions = require('./src/kafka/producer.js')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const expressJSDocSwagger = require('express-jsdoc-swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json());

const options = {
  definition: {
    "openapi": "3.0.1",
    "info": {
       "title": "Inventory Service with Kafka",
       "description": "API for updating the Inventory Service.",
       "version": "1.0.0"
    },
    "servers": [
       {
          "url": "http://localhost:3000"
       }
    ],
  },
  apis: ['./src/routes*.js'], // files containing annotations as above
};

const openapiSpecification = await swaggerJsdoc(options);

app.get('/', function (req, res) {
  res.redirect('/api-docs')
})

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
    kafkaFunctions(req.body, messageOrigin);
    res.send('Inventory Update Sent')
  } catch (error) {
    res.status(500).json(error);
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
