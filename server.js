const express = require('express')
const app = express()
const port = 3000
const kafkaFunctions = require('./src/kafka/producer.js')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', function (req, res) {
  res.redirect('/api-docs')
})

app.post('/inventory/update', (req, res) => {
  console.log('Inventory Update')
  console.log(req)
  console.log('KAFKA', kafkaFunctions)
  kafkaFunctions
  res.send('Inventory Update Called')
})

app.get('/api/test', (req, res) => {
  console.log('TEST')
  res.send('TEST Request Called')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
