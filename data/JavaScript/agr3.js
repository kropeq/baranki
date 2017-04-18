var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/baranki';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);

  var col = db.collection('names');
  console.log("Gender;Average\r");
    // Średnia roczna urodzeń dziewczynek i chłopców w Stanach Zjednoczonych w latach 1910-2014
    col.aggregate([
		{ $group: {
      _id: { Gender: "$Gender", Year: "$Year" },
      Suma: { $sum: "$Count" }
    }},
    { $group: {
      _id: { Gender: "$_id.Gender" },
      Average: { $avg: "$Suma" }
    }},
    { $sort: { "Average" : -1}}
      ]).toArray(function(err, docs) {
      if(!err){
      	db.close();
      	var intCount = docs.length;
      	if( intCount > 0 ){
      		for (var i = 0; i < intCount; i++){
      			console.log(docs[i]._id.Gender + ';' + docs[i].Average + "\r");
      		}
      	}
      } else {
      	onErr(err, callback);
      }
    });
  });
