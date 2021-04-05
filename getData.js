var MongoClient = require('mongodb').MongoClient;
//var  = "mongodb://followyolo-shard-00-02.aa13r.mongodb.net:27017/";

const url = "mongodb+srv://followyolo:PNIgIlScd8AGo8dZ@followyolo.aa13r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";



class GetData {
    getAllUsers(callback) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("followyolo");
            dbo.collection("Users").find({}).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            db.close();
            callback(result);
            });
        });
    };

    autenticate(callback,body) {
      MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("followyolo");
          dbo.collection("Users").find({_id : body._id ,password : body.password}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
          if(!result.length)
          callback({message:"Autenticacao Fail"});
        else
          callback({message:"Autenticacao Sucsess"});
        });
      });
  };

  balaceCheck(callback,body) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("followyolo");
        dbo.collection("Users").find({_id : body._id ,password : body.password,balance :{ $gte :  body.balance}}).toArray(function(err, result) {
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
    getAllRobos(callback) {
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
}
module.exports = GetData;