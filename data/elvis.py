import pymongo
from pymongo import MongoClient
client = MongoClient()

db = client['baranki']
collection = db['names']

pipeline = [
	{ "$match": { "Name": "Elvis" } },
	{ "$group": {
		"_id": { "Year": "$Year" },
		"Number": { "$sum": "$Count" }
	}},
	{ "$sort": { "_id.Year" : 1}}
]
 
zapytanie = db.names.aggregate(pipeline)

for doc in zapytanie:
   print(doc)