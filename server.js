const express = require('express');
const app = express();
const port = 3000;
const kafkaFunctions = require('./src/kafka/producer.js');

const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', function(req, res) {
  res.redirect('/api-docs');
});

app.post('/inventory/update', (req, res) => { 
  console.log('Inventory Update');
  console.log("request", req);
  console.log("KAFKA", kafkaFunctions);
  res.send("POST Request Called"); 
});

app.get('/api/test', (req, res) => { 
  console.log('TEST');
  res.send("POST Request Called"); 
}) 

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})