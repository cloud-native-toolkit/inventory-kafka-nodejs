const express = require('express')
const app = express()
const port = 3000
const kafkaFunctions = require('./src/kafka/producer.js')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json());

app.get('/', function (req, res) {
  res.redirect('/api-docs')
})

app.post("/inventory/update", (req, res) => {
  try {
    console.log(req.body);
    kafkaFunctions(req.body);
    res.send('Inventory Update Called')
  } catch (error) {
    res.status(500).json(error);
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
