
var get = require('./getData');
var save = require('./saveData');

var express = require('express');
var app = express();
app.use(express.json())

app.get('/robots', function(req, res) {
    get.getAllRobos(function(result) {
    res.json(result);
    });
});

app.get('/ip', function(req, res) {
    const parseIp = (req) =>
    req.headers['x-forwarded-for']?.split(',').shift()
    || req.socket?.remoteAddress
    res.json({"Ip":parseIp(req)});
});

app.get('/start', function(req, res) {
});

app.get('/robot/:id', function(req, res) {
    get.getRobot(function(result) {
    res.json(result);
    },req.params.id);
});

app.post('/robot/:id/lost', function(req, res) {
    save.saveLost(function(result,statusCode) {
        res.status(statusCode).json(result);
    },req.params.id,req.body);
});

app.get('/users', function(req, res) {
    get.getAllUsers(function(result,statusCode) {
        res.status(statusCode).json(result);
    });
});

app.post('/users/active', function(req, res) {
    get.getAllActiveUsers(function(result,statusCode) {
        res.status(statusCode).json(result);
    },req.body);
});

app.post('/startRent', function(req, res) {
    save.startRent(function(result,statusCode) {
        res.status(statusCode).json(result);
    },req.body);
});

app.post('/endRent', function(req, res) {
    save.endRent(function(result,statusCode) {
        res.status(statusCode).json(result);
    },req.body);
});

app.post('/calladmin', function(req, res) {
    save.calladmin(function(result,statusCode) {
        res.status(statusCode).json(result);
    },req.body);
});

app.get('/usercalls', function(req, res) {
    get.usercalls(function(result,statusCode) {
        res.status(statusCode).json(result);
    });
});

app.get('/market/points', function(req, res) {
    get.marketPoints(function(result,statusCode) {
        res.status(statusCode).json(result);
    });
});

app.post('/save/map', function(req, res) {
    save.saveMap(function(result,statusCode) {
        res.status(statusCode).json(result);
    },req.body);
});

app.get('/delet/map', function(req, res) {
    save.deletMap(function(result,statusCode) {
        res.status(statusCode).json(result);
    });
});

app.get('/save/map', function(req, res) {
    get.getMap(function(result,statusCode) {
        res.status(statusCode).json(result);
    });
});

app.post('/robot', function(req, res) {
    save.insertRobo(req.body);
    res.json({requestBody: req.body})
});

app.post('/signup', function(req, res) {
    save.insertUser(function(result,statusCode) {
        res.status(statusCode).json(result);
        },req.body);
});

app.post('/login', function(req, res) {
    get.autenticate(function(result,statusCode) {
    res.status(statusCode).json(result);
    },req.body);
});

app.post('/balanceCheck', function(req, res) {
    get.balaceCheck(function(result) {
    res.json(result);
    },req.body);
});

app.post('/addBalance', function(req, res) {
    save.addBalance(function(result,statusCode) {
        res.status(statusCode).json(result);
    },req.body).catch(function(e) {
      });
});

app.get('/', function(req, res) {
    res.json( {message : "server is running"})
});

app.set('port', process.env.PORT || 3000); // Process.env.PORT change automatically the port IF 3000 port is being used.
app.listen(app.get('port'), () => console.log(`Node server listening on port ${app.get('port')}!`));