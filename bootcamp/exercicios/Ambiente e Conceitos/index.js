const express = require('express');
const server = express();

server.use(express.json());

server.use((req, res, next) =>{
  console.time("Request time execution")
  console.log(`URL: ${req.url} ==> Método: ${req.method}`);
  next()
  console.timeEnd("Request time execution")
});

const users = ['Diego', 'Renato2', 'José'];

function checkNameOnBody(req, res, next) {
  if(!req.body.name){
    return res.status(400).json({erro: "User name is required."})
  }

  return next();
}

function checkUserExists(req, res, next) {
  const user = users[req.params.index];
  if(!user){
    return res.status(400).json({erro: "User does not exists."})
  }

  req.user = user;

  return next();
}

server.get('/teste', (req, res, next) => {
  const nome = req.query.nome;
  return res.json({ message: `Hello ${nome ? nome : 'World'}`});
});

server.get('/users', (req, res, next) => {
  res.json(users);
});

server.get('/users/:index', checkUserExists, (req, res, next) => {
  return res.json(req.user);
});

server.post('/users', checkNameOnBody, (req, res, next) => {
  const {name} = req.body;
  users.push(name);
  return res.json(users)
});

server.put('/users/:index', checkUserExists, checkNameOnBody, (req, res, next) => {
  const {index} = req.params;
  const {name} = req.body;
  users[index] = name;
  return res.json(users);
});

server.delete('/users/:index', checkUserExists, (req, res, next) => {
  const {index} = req.params;
  users.splice(index, 1);
  return res.send();
});

server.listen(3000);