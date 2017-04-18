import pymongo
from pymongo import MongoClient
client = MongoClient()

db = client['baranki']
collection = db['names']

pipeline = [
	{ "$match": {
		"$and": [{
			"Name": {	"$regex": "^M" },
			"Gender": "M"
		}]
	} },
	{ "$group": {
		"_id": { "Name": "$Name"},
		"Suma": { "$sum": "$Count" }
	}},
	{ "$sort": { "Suma" : -1}},
	{ "$limit": 6 },
	{ "$skip": 1 }
]
 
zapytanie = db.names.aggregate(pipeline)

for doc in zapytanie:
   print(doc)