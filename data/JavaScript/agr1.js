var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/baranki';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);

  var col = db.collection('names');
  console.log("Gender;Name;Number\r");
    // Najczesciej nadawane imiona w Stanach Zjednoczonych w latach 1910-2014
    col.aggregate([
		{ $group: { 
			_id: { Gender: "$Gender", Name: "$Name" }, 
			Number: { $sum: "$Count" } 
		}}, 
		{ $sort: { Number: -1 }
		}, 
		{ $limit: 10 }
      ]).toArray(function(err, docs) {
      if(!err){
      	db.close();
      	var intCount = docs.length;
      	if( intCount > 0 ){
      		for (var i = 0; i < intCount; i++){
      			console.log(docs[i]._id.Gender + ';' + docs[i]._id.Name + ';' + docs[i].Number + "\r");
      		}
      	}
      } else {
      	onErr(err, callback);
      }
    });
  });
