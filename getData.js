var MongoClient = require('mongodb').MongoClient;
//var  = "mongodb://followyolo-shard-00-02.aa13r.mongodb.net:27017/";

const url = "mongodb+srv://followyolo:PNIgIlScd8AGo8dZ@followyolo.aa13r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(url);
client.connect();

async function getAllUsers(callback) {
  const database = client.db("followyolo");
  const users = database.collection("Users");
  var user = await users.find({}).toArray();
      //.toArray(function(err, result);
  return callback(user,200);
};

async function autenticate(callback,body) {

  const query = { 
      email : body.email,
      password : body.password
  };
  
  const database = client.db("followyolo");
  const users = database.collection("Users");
  var user = await users.findOne(query);
  if(!user){
    return callback({message:"Autenticacao Fail"},400);
  }
  else{
    return callback({nome : user.nome,balance: user.balance,adm:user.adm},200);
  }
};


function balaceCheck(callback,body) {
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("followyolo");
    dbo.collection("Users").find({email : body.email ,password : body.password,balance :{ $gte :  body.balance}}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
    if(!result.length)
      callback({message:"Balance Check Fail"});
    else
      callback({message:"Balance Check Sucsess"});
    });
});
};
function getAllRobos(callback) {
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("followyolo");
    dbo.collection("Robos").find({}).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result);
      db.close();
      callback(result);
    });
  });

};

async function getAllActiveUsers(callback,body) {
    
  var query = { 
    email : body.email,
    password : body.password,
    //robot_id :{ $gte :  1}
  };
  const database = client.db("followyolo");
  const users = database.collection("Users");
  var user = await users.findOne(query);
  if(!user)
    return callback({"message":"Usuario Invalido"},400)

  query = { 
    robot_id :{ $gte :  1}
  };
  var fields ={
    _id: 0,
    nome: 1,
    email: 1 ,
    robot_id: 1 
  }
  var user = await users.find(query).project(fields).toArray();
  return callback(user,200);
};
async function getMap(callback) {

  const database = client.db("followyolo");
  const users = database.collection("Market");

  var map = await users.find({}).toArray();
  return callback(map,200);
};

async function getRobot(callback,id) {

  const database = client.db("followyolo");
  const users = database.collection("Robos");

  query = { 
    robot_id : parseInt(id)
  };

  var robot = await users.findOne(query);
  if(!robot){
    return callback({"message":"Robot not found"},400);
  }
  return callback(robot,200);
};
async function usercalls(callback) {

  var fields ={
    _id: 1,
    name: 1,
    email: 1 ,
    reason: 1 
  }
  const database = client.db("followyolo");
  const users = database.collection("Calls");

  var call = await users.find({}).project(fields).toArray();
  return callback(call,200);
};

async function marketPoints(callback) {

  const database = client.db("followyolo");
  const users = database.collection("Market_XY");

  var call = await users.find({}).toArray();
  return callback(call,200);
};

async function getPoint(callback,id) {

  const database = client.db("followyolo");
  var goto = database.collection("Goto");
  var robo = await goto.findOne({robot_id:id});
  return callback(robo,200);
};

module.exports = {getAllUsers,
                autenticate,
                balaceCheck,
                getAllRobos,
                getAllActiveUsers,
                getMap,
                getRobot,
                usercalls,
                marketPoints,
                getPoint};