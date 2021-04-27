var MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');
const url = "mongodb+srv://followyolo:PNIgIlScd8AGo8dZ@followyolo.aa13r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(url);
client.connect();
var Double = require("mongodb").Double;

function insertRobo(body){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("followyolo");
        
        console.log(body);
        dbo.collection("Robos").insertOne(body);
        db.close();
    });
};
async function insertUser(callback,body){

    if(!body.email||!body.password){
        return callback({"message":"email ou senha faltante"},400);
    }
    if(!body.balance){
        body.balance=Double(0.0);
    }
    if(!body.adm){
        body.adm=0;
    }
    if(!body.cnpj){
        body.cnpj=0;
    }
    if(!body.robot_id){
        body.robot_id=0;
    }
    if(!body.device_plataform){
        body.device_plataform="Android";
    }
    if(!body.device_id){
        body.device_id="";
    }
    const database = client.db("followyolo");
    const users = database.collection("Users");
    const query = { 
        email : body.email
    };

    var user = await users.findOne(query);
    if(user){
        return callback({"message":"email ja cadastrado"},400);
    }
    else{
        user = await users.insertOne(body);
    }
    return callback({"message":"cadastro realiazado", body},200);

}; 
async function addBalance(callback,body){
    const database = client.db("followyolo");
    const users = database.collection("Users");

    const query = { 
        email : body.email,
        password : body.password 
    };

    var user = await users.findOne(query);
    if(!user){
        return callback({"message":"User not Found"},400);
    }
    if(!user.balance){
        user.balance=Double(0.0);
    }
    var newBalance = user.balance+body.balance;
    newBalance = newBalance.toFixed(2);
    console.log(newBalance);
    const update = {
        "$set": {
            "balance": Double(newBalance),
        }
    };
    console.log(newBalance);
    users.findOneAndUpdate(user, update);
    console.log(update);
    return callback({"newBalance":newBalance},200) ;
};

async function startRent(callback,body) {
    
    var database = client.db("followyolo");
    var base = database.collection("Robos");

    var query = { 
      qrcode: body.qrcode,
      state: "STANDY_BY"
      //robot_id :{ $gte :  1}
    };
    var update = { 
        "$set": {
            state:"RENTED"
        }
    };
    var robo = await base.findOneAndUpdate(query,update);
    if(!robo.value)
      return callback({"message":"Robo Invalido"},400);
    query = { 
        email : body.email,
        password : body.password ,
        robot_id : 0
    };
    var update = { 
        "$set": {
        robot_id : robo.value.robot_id,
        cnpj : robo.value.cnpj
        }
    };
    var base = database.collection("Users");
    var user = await base.findOneAndUpdate(query,update);
    if(!user.value){
        var query = { 
          qrcode: body.qrcode
        };
        var update = { 
            "$set": {
                state:"STANDY_BY"
            }
        };
        await base.findOneAndUpdate(query,update);
        return callback({"message":"Start Rent Failed"},400);
    }
    return callback({"message":"Start Rent Ok",
    robot_id : robo.value.robot_id},200);
};

async function endRent(callback,body) {
    
    var database = client.db("followyolo");
    var base = database.collection("Users");
    
    query = { 
        email : body.email,
        password : body.password,
        //robot_id :body.,
        balance : {$gte :  -1}
    };
    var user = await base.findOne(query);
    if(!user){
        return callback({"message":"End Rent Failed","error":"Usuario com saldo negativo"},400);
    }
    var newBalance= user.balance-Math.ceil(body.time/30)*10;
    newBalance = Double(newBalance.toFixed(2));
    
    query = { 
        //email : body.email,
        //password : body.password,
        robot_id :body.robot_id
    };
    var update = { 
        "$set": {
            balance: newBalance,
            robot_id : 0,
            cnpj : 0
        }
    };

    user = await base.findOneAndUpdate(query,update);
    console.log(user.value);
    if(!user.value){
        return callback({"message":"End Rent Failed","error":"Usuario invalido"},400);
    }
    
    var base = database.collection("Robos");

    var query = { 
      //qrcode: body.qrcode,
      state: "RENTED",
      robot_id :body.robot_id
    };
    var update = { 
        "$set": {
            state:"STANDY_BY"
        }
    };
    var robo = await base.findOneAndUpdate(query,update);
    if(!robo){
        return callback({"message":"End Rent Failed","error":"Robo invalido"},400);
    }
    return callback({"message":"End Rent Ok","newBalance":newBalance},200);
};
async function saveMap(callback,body) {
    
    var database = client.db("followyolo");
    var base = database.collection("Market");
    await base.insertOne(body);

    return callback({"message":"Map Saved"},200);
};
async function deletMap(callback,body) {
    
    var database = client.db("followyolo");
    var base = database.collection("Market");
    await base.deleteMany({});
    console.log("deletado");
    return callback({"message":"Map Deleted"},200);
};

async function saveLost(callback,id,body) {

    const database = client.db("followyolo");
    const users = database.collection("Robos");
  
    query = { 
      robot_id : parseInt(id)
    };
  
    var update = { 
        "$set": {
            islost:body.islost
        }
    };
    var robot = await users.findOneAndUpdate(query,update);
    if(!robot){
      return callback({"message":"failed"},400);
    }
    return callback(body,200);
  };
async function calladmin(callback,body) {
    
    var database = client.db("followyolo");
    var base = database.collection("Calls");
    await base.insertOne(body);
    //var date = new Date(jsonDate);
    //console.log(date);
    return callback({"message":"success"},200);
};

async function deletecalladmin(callback,body) {
    
    var database = client.db("followyolo");
    var base = database.collection("Calls");
    var del = await base.deleteOne({_id : mongodb.ObjectId(body._id)});
    if(del.deletedCount==0)
        return callback({"message":"call not found"},400);
    return callback({"message":"Delete success"},200);

};
async function savePoint(callback,id,body) {
    
    const database = client.db("followyolo");
    var goto = database.collection("Goto");
    var robo = await goto.findOne({robot_id:id});
    console.log(robo);
    if(robo){
        return callback({"message":"Robot still has a point to go"},400);
    }
    var robos = database.collection("Market_XY");
    var ponto = await robos.findOne({point_name : body.point_name});
    console.log(ponto);
    if(!ponto){
        return callback({"message":"Point not found"},400);
    }
    var robos = database.collection("Goto");
    var robo = robos.insertOne({robot_id:id,point_name:ponto.point_name,point_x:ponto.point_x,point_y:ponto.point_y});
    return callback({"message":"Point save"},200);
};

async function deletePoint(callback,id,body) {
    
    const database = client.db("followyolo");
    var robos = database.collection("Goto");
    var ponto = await robos.deleteOne({robot_id : id});
    if(ponto.deletedCount==0)
        return callback({"message":"GoTo not found to delete"},400);
    return callback({"message":"Point Deleted"},200);
};

module.exports = {insertRobo,
                insertUser,
                addBalance,
                startRent,
                endRent,
                saveMap,
                deletMap,
                saveLost,
                calladmin,
                deletecalladmin,
                savePoint,
                deletePoint};