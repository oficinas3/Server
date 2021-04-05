var MongoClient = require('mongodb').MongoClient;

const url = "mongodb+srv://followyolo:PNIgIlScd8AGo8dZ@followyolo.aa13r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


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
    insertUser(body){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("followyolo");
            
            console.log(body);
            dbo.collection("User").insertOne(body);
            db.close();
        });
    }; 
}
module.exports = SaveData;