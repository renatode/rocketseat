//#region Express Init
const express = require('express');
const server = express();
//#endregion

//#region My MiddleWares
function bodyValidator(req, res, next) {
  if (!req.body.id && !req.params.id) {
    return res.status(400).json({error: 'Id is required!'});
  }
  if (!req.body.title) {
    return res.status(400).json({error: 'Title is required!'});
  }
  return next();
}

function checkProjectExists(req, res, next) {
  const {id} = req.params;
  if (id) {
    const proj = projects.find(p => p.id == id);
    if (!proj) {
      return res.status(400).json({error: 'Project does not exists!'});
    }
  }
  return next();
}

function reqCounter(req, res, next) {
  console.count("Número de requisições");  
  return next();
}
//#endregion

//#region Express ADD Global Middllewares
server.use(express.json());
server.use(reqCounter);
//#endregion

//#region Global Variables
let projects = [];
//#endregion

//#region Express Routes
server.post('/projects', bodyValidator, (req, res, next) =>{
  let {id, title, tasks} = req.body;
  const proj = projects.find(p => p.id === id);

  if (proj) {
    return res.status(400).json({error: 'Project already exists!'});
  }

  if (!tasks) {
    tasks = [];
  }
  
  projects.push({
    id,
    title,
    tasks
  });

  return res.json(projects);
});

server.get('/projects', (req, res, next) =>{
  return res.json(projects);
});

server.put('/projects/:id', bodyValidator, checkProjectExists, (req, res, next) =>{
  const {id} = req.params;
  const {title} = req.body;
  const proj = projects.find(p => p.id == id);

  proj.title = title;

  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExists, (req, res, next) =>{
  const {id} = req.params;

  projects = projects.filter(p => p.id != id);

  return res.json(projects);
});

server.post('/projects/:id/tasks', bodyValidator, checkProjectExists, (req, res, next) =>{
  const {id} = req.params;
  const {title} = req.body;
  const proj = projects.find(p => p.id == id);

  proj.tasks.push(title);

  return res.json(projects);
});
//#endregion

server.listen(3001);