import pymongo
from pymongo import MongoClient
client = MongoClient()

db = client['baranki']
collection = db['names']

pipeline = [
	{ "$group": {
		"_id": { "Gender": "$Gender", "Year": "$Year" },
		"Suma": { "$sum": "$Count" }
	}},
	{ "$group": {
		"_id": { "Gender": "$_id.Gender" },
		"Average": { "$avg": "$Suma" }
	}},
	{ "$sort": { "Average" : -1}}
]
 
zapytanie = db.names.aggregate(pipeline)

for doc in zapytanie:
   print(doc)