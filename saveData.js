var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


class SaveData {
    insertRobo(body){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("followyolo");
            
            console.log(body);
            dbo.collection("Robos").insertOne(body);
            db.close();
        });
    }; 
}
module.exports = SaveData;