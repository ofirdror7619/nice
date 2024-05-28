const express = require('express');
const bodyParser = require('body-parser');
const { postReq }  = require('./http-post-request');
const RoundRobin = require('./roundrobin');
const app = express();
const port = 3000;

const destinationPort = 3001;
const destinationPath = 'neworder';
app.use(bodyParser.json());

const menu = [
  { id: 1, name: 'Hamburger', price: 60, prepTime: 10 },
  { id: 2, name: 'Pizza', price: 50, prepTime: 7 },
  { id: 3, name: 'Steak', price: 90, prepTime: 8 }
];

const waiters = [
  { name: 'Waiter 1', available: true },
  { name: 'Waiter 2', available: false },
  { name: 'Waiter 3', available: true },
  { name: 'Waiter 4', available: true },
  { name: 'Waiter 5', available: false }
];

const orders = [];
const readyOrders = [];

let cashFLow = 0;

let ordersId = 1;

app.get('/menu', (req, res) => {
    res.send(menu);
  });
  
app.get('/readyOrders', (req, res) => {
    res.send(readyOrders);
  });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  
app.post('/newdish', (req, res) => {
    const newDish = req.body;
    console.log(`New Dish Request: ${req.body.id}`);
    menu.push(newDish);

    res.status(201).send({
      message: 'Dish added successfully',
      dish: newDish
    });
  });

app.post('/readyorders', (req, res) => {
    const newReadyOrder = req.body;
    console.log(`New ready Order`);
    readyOrders.push(newReadyOrder);

    orders.filter(order => order !== newReadyOrder);

    res.status(201).send({
      message: 'New ready order added successfully',
      newReadyOrder: newReadyOrder
    });

    readyOrders.filter(order => order !== newReadyOrder);
    const roundRobin = new RoundRobin(waiters);
    let availableWorker = roundRobin.getNextAvailableWorker();
    console.log(`The waiter is: ${availableWorker.name}`);
    roundRobin.setCurrentWorkerToNotAvailable(availableWorker);

    roundRobin.setCurrentWorkerToAvailable(availableWorker);

  });

app.post('/neworder', (req, res) => {
    console.log(`New order Request`);

    const newOrderObject = {
      table: req.body.table,
      id: ordersId,
      dishesInOrder: []
    }

    ordersId++;

    for (const dish of req.body.dishes) {
      const dishFound = menu.find(menuDish => menuDish.id === dish);
      if ((dishFound === undefined)) {
        res.status(400).send({
          message: 'Dish not found',
        });
        break;
      }
      newOrderObject.dishesInOrder.push(menu.find(menuDish => menuDish.id === dish));
    }
  
    orders.push(newOrderObject);

    res.status(201).send({
      message: 'Order added successfully',
      newOrder: orders
    });

    postReq(JSON.stringify(newOrderObject), destinationPort, destinationPath);

  });

  app.get('/orders', (req, res) => {
    res.send(orders);
  });
  
  app.get('/cashflow', (req, res) => {
    res.send(cashFLow.toString());
  });
  

  app.post('/payment', (req, res) => {
    const payment = req.body.payment;
    console.log(`New payment received`);
    cashFLow += payment;

    res.status(201).send({
      message: 'payment',
      payment: payment
    });
  });

 