var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

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