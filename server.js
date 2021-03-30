
const GetData = require('./getData');
const getData = new GetData();
const SaveData = require('./saveData');
const saveData = new SaveData();

var express = require('express');
var app = express();
app.use(express.json())

app.get('/robos', function(req, res) {
    getData.getAllRobos(function(result) {
    res.json(result);
    });
});

app.get('/users', function(req, res) {
    getData.getAllUsers(function(result) {
    res.json(result);
    });
});

app.post('/robo', function(req, res) {
    saveData.insertRobo(req.body);
    res.json({requestBody: req.body})
});

app.listen(3000, function() {
  console.log('Nosso Server esta escutando na porta 3000!');
});