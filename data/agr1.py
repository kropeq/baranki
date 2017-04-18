import pymongo
from pymongo import MongoClient
client = MongoClient()

db = client['baranki']
collection = db['names']

pipeline = [
	{ "$group": { 
		"_id": { "Gender": "$Gender", "Name": "$Name" }, 
		"Number": { "$sum": "$Count" } 
	}}, 
	{ "$sort": { "Number": -1 }
	}, 
	{ "$limit": 10 }
]
 
zapytanie = db.names.aggregate(pipeline)

for doc in zapytanie:
   print(doc)