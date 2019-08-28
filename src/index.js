const express = require('express');

const server = express();

server.use(express.json());

let numberOfRequests = 0;
const projeto = []

function checkProjectId(req, res, next) {
    const { id } = req.params;
    const project = projeto.find(p => p.id === id);

    if(!project) {
        return res.status(400).json({error: 'Project not found'})
    }

    return next();
}

function logRequests(req, res, next) {
    numberOfRequests++;

    console.log(`Número de requisições: ${numberOfRequests} ` );
    return next();
}

server.use(logRequests);

server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const project = {
         id,
         title,
         tasks: []
    };

    projeto.push(project);

    return res.json(projeto)
});

server.get('/projects', (req, res) => {
    return res.json(projeto)
})

server.put('/projects/:id', checkProjectId, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    const project = projeto.find(p => p.id === id );
    project.title = title;

    return res.json(project)
    
    
})

server.delete('/projects/:id', checkProjectId, (req, res) => {
    const { id } = req.params;

    const projectIndex = projeto.findIndex(p=> p.id === id); 

    projeto.splice(projectIndex, 1);

    return res.send();
})

server.post('/projects/:id/tasks', checkProjectId, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projeto.find(p => p.id === id);

    project.tasks.push(title);

    return res.json(project)
})



server.listen(3000);