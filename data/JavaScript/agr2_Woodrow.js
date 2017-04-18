var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/baranki';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);

  var col = db.collection('names');
  console.log("Year;Number\r");
    // Znalezienie okresu największej popularności wybranych imion - Woodrow
    col.aggregate([
		{ $match: { Name: "Woodrow" } },
    { $group: {
      _id: { Year: "$Year" },
      Number: { $sum: "$Count" }
    }},
    { $sort: { "_id.Year" : 1}}
      ]).toArray(function(err, docs) {
      if(!err){
      	db.close();
      	var intCount = docs.length;
      	if( intCount > 0 ){
      		for (var i = 0; i < intCount; i++){
      			console.log(docs[i]._id.Year + ';' + docs[i].Number + "\r");
      		}
      	}
      } else {
      	onErr(err, callback);
      }
    });
  });
