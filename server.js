const express = require('express');
const app = express();
const port = 3000;
const kafkaFunctions = require('./src/kafka/producer.js');

const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/updateInventory', (req, res) => { 
  console.log("POST");
  console.log("request", req);
  console.log("KAFKA", kafkaFunctions);
  if (!req.body.name) { 
    return res.status(400).send({ success: "false", message: "name is required", }); 
  } 
  else if (!req.body.companies) { 
    return res.status(400).send({ success: "false", message: "companies is required", }); 
  } 
  const user = { id: userList.length + 1, isPublic: req.body.isPublic, name: req.body.name, companies: req.body.companies, books: req.body.books }; 
  userList.push(user); 
  return res.status(201).send({ success: "true", message: "user added successfully", user, });
});

console.log('Kafka Started');
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})