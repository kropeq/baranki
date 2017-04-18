var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/baranki';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);

  var col = db.collection('names');
  console.log("Name;Suma\r");
    // Top 2-6 najczęściej nadawanych imion męskich zaczynających się literą "M"
    col.aggregate([
		{ $match: {
      $and: [{
        Name: { $regex: new RegExp(/^M/) },
        Gender: "M"
      }]
    } },
    { $group: {
      _id: { Name: "$Name"},
      Suma: { $sum: "$Count" }
    }},
    { $sort: { Suma : -1}},
    { $limit: 6 },
    { $skip: 1 }
      ]).toArray(function(err, docs) {
      if(!err){
      	db.close();
      	var intCount = docs.length;
      	if( intCount > 0 ){
      		for (var i = 0; i < intCount; i++){
      			console.log(docs[i]._id.Name + ';' + docs[i].Suma + "\r");
      		}
      	}
      } else {
      	onErr(err, callback);
      }
    });
  });
