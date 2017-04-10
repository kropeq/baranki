# Projekt na egzamin - zespół Baranki

Członkowie zespołu:
* Paulina Seroka
* Michał Jaworowski

### Parametry komputera testowego

|Jednostka|Parametr|
|------------|:-------------:|
|System|Windows 7 64bit|
|Procesor|Intel(R) Core(TM) i5-2450M|
|Ilość rdzeni|2|
|Moc rdzenia|2.50GHz|
|Pamięć RAM|4,00 GB|

### Zbiór danych

Nazwa: **_US Baby Names_**

Źródło: **_[Pobierz](https://www.kaggle.com/kaggle/us-baby-names)_**

Plik: **_StateNames.csv_**

Rekordy: **_5 647 426_**

### Agregacje na zbiorze US Baby Names

Każdy dokument w tej kolecji zawiera kolumny:

|Id|Name|Year|Gender|State|Count|
|---|---|---|---|---|---|

Początek pliku:

```
Id,Name,Year,Gender,State,Count
4,Margaret,1910,F,AK,8
5,Helen,1910,F,AK,7
6,Elsie,1910,F,AK,6
7,Lucy,1910,F,AK,6
8,Dorothy,1910,F,AK,5
```

Znaczenie kolumn:

* ```Id``` pole zawiera numer rekordu
* ```Name``` pole zawiera nadane imię dla dziecka
* ```Year``` pole zawiera rok narodzin dziecka
* ```Gender``` pole zawiera płeć dziecka
* ```State``` pole zawiera stan w USA narodzin dziecka
* ```Count``` pole zawiera liczbę nadań takiego imienia

### Agregacja 1: Najczęściej nadawane imiona w Stanach Zjednoczonych w latach 1910-2014

#### Kobiece imiona

Aby uzyskać 10 najczęściej nadawanych kobiecych imion dla dziecka, korzystamy z następującej agregacji:

```js
db.baranki.aggregate(
	{ $group: { 
		_id: { Gender: "$Gender", Name: "$Name" }, 
		Number: { $sum: "$Count" } 
	}}, 
	{ $sort: { Number: -1 }
	}, 
	{ $match: { "_id.Gender": {$regex: "F" }}},
	{ $limit: 10 }
)
```

Wynik:

```json
{ "_id" : { "Gender" : "F", "Name" : "Mary" }, "Number" : 3730856 }
{ "_id" : { "Gender" : "F", "Name" : "Patricia" }, "Number" : 1567779 }
{ "_id" : { "Gender" : "F", "Name" : "Elizabeth" }, "Number" : 1500462 }
{ "_id" : { "Gender" : "F", "Name" : "Jennifer" }, "Number" : 1461813 }
{ "_id" : { "Gender" : "F", "Name" : "Linda" }, "Number" : 1446300 }
{ "_id" : { "Gender" : "F", "Name" : "Barbara" }, "Number" : 1422972 }
{ "_id" : { "Gender" : "F", "Name" : "Margaret" }, "Number" : 1121985 }
{ "_id" : { "Gender" : "F", "Name" : "Susan" }, "Number" : 1108255 }
{ "_id" : { "Gender" : "F", "Name" : "Dorothi" }, "Number" : 1051603 }
{ "_id" : { "Gender" : "F", "Name" : "Jessica" }, "Number" : 1038060 }
```

Powyższa agregacja jest zbudowana z kilku operatorów:

* ```$group``` - wymaga pola __id_, w którym wyznaczamy po jakich polach grupujemy, a pole _Number_ korzysta z funkcji agregacji ```$sum```, która zsumowuje liczbę nadanych tych samych imion poszczególnych płci po polu _Name_
* ```$sort``` - opiera się o wcześniej utworzone pole _Number_ i sortuje malejąca względem tej kolumny
* ```$match``` - korzysta z grupowanego pola _Gender_ i wybiera za pomocą funkcji ```$regex``` rekordy zawierające słowo _F_ w polu _Gender_
* ```$limit``` - ograniczamy liczbę rekordów wynikowych do 10

