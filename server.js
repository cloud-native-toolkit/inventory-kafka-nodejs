const express = require('express');
const http = require('http');
const app = express()
const server = http.createServer(app);
const port = process.env.PORT || 3000

const healthRoute = require('./src/routes/health-route')
const inventoryRoute = require('./src/routes/inventory-route')

const swaggerUi  = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  "openapi": '3.0.1',
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
  apis: ['./src/routes/*', './src/parameters/*']
};
const swaggerSpec = swaggerJsdoc(options);

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', function (req, res) {
  res.redirect('/api-docs')
})

healthRoute.setup(app);
inventoryRoute.setup(app);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
         message: error.message
      }
    });
})

//Server Config
server.listen(3000);
server.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});

module.exports = server