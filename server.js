// server.js
const { on, listen } = require('./serverLib');
const fs = require('fs');

let resources = {};

on('GET', '/index.html', (req, res) => {
    fs.readFile('index.html', (err, data) => {
        if (err) {
            res.send(500, 'Internal Server Error');
        } else {
            res.send(200, data.toString());
        }
    });
});

on('POST', '/resource', (req, res) => {
    const id = Date.now();
    resources[id] = JSON.parse(req.body);
    res.send(201, JSON.stringify({ id, ...resources[id] }));
});

on('GET', '/resource', (req, res) => {
    res.send(200, JSON.stringify(resources));
});

on('PUT', '/resource', (req, res) => {
    const { id, ...data } = JSON.parse(req.body);
    if (resources[id]) {
        resources[id] = { ...resources[id], ...data };
        res.send(200, `Resource ${id} updated`);
    } else {
        res.send(404, `Resource ${id} not found`);
    }
});

on('DELETE', '/resource', (req, res) => {
    const { id } = JSON.parse(req.body);
    if (resources[id]) {
        delete resources[id];
        res.send(200, `Resource ${id} deleted`);
    } else {
        res.send(404, `Resource ${id} not found`);
    }
});

const PORT = process.env.PORT || 8080;
listen(PORT);
