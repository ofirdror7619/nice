const express = require('express');
const { postReq }  = require('./http-post-request');
const bodyParser = require('body-parser');
const RoundRobin = require('./roundrobin');
const app = express();
const port = 3001;

const destinationPort = 3000;
const destinationPath = 'readyorders';

app.use(bodyParser.json());

const chefs = [
  { name: 'Chef 1', available: true },
  { name: 'Chef 2', available: false },
  { name: 'Chef 3', available: true }
];

const newOrders = [];

app.get('/orders', (req, res) => {
    res.send(newOrders);
  });

app.post('/neworder', (req, res) => {
    const newOrder = req.body;
    newOrders.push(newOrder);

    const roundRobin = new RoundRobin(chefs);
    let availableWorker = roundRobin.getNextAvailableWorker();
    console.log(`The chef is: ${availableWorker.name}`);
    roundRobin.setCurrentWorkerToNotAvailable(availableWorker);

    postReq(JSON.stringify(newOrder), destinationPort, destinationPath);

    res.status(201).send({
      message: 'Order received successfully',
      order: newOrder,
      chef: availableWorker
    });

    
  });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
 
  