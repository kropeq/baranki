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

Źródło: **_[Pobierz](https://www.kaggle.com/kaggle/us-baby-names/downloads/StateNames.csv.zip)_**

Plik: **_StateNames.csv_**

Rekordy: **_5 647 426_**

### Agregacje na zbiorze US Baby Names

Każdy dokument w tej kolecji zawiera kolumny:

|Id|Name|Year|Gender|State|Count|
|---|---|---|---|---|---|

Początek pliku:

```json
Id,Name,Year,Gender,State,Count
1,Mary,1910,F,AK,14
2,Annie,1910,F,AK,12
3,Anne,1910,F,AK,10
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

### Import danych

```powershell "Measure-Command{mongoimport -d baranki -c names --type csv --file C:\folder\StateNames.csv --headerline}"```

#### Czas importu

```Total seconds : 126,9938100```

##### Liczba zaimportowanych danych

```5 647 426```

#### Obciążenie komputera podczas importowania

##### CPU

![alt tag](https://github.com/kropeq/baranki/blob/master/images/import_CPU.png)

##### RAM

![alt tag](https://github.com/kropeq/baranki/blob/master/images/import_RAM.png)

* 1.52 GB przed uruchomieniem bazy
* 1.62 GB po uruchomieniu bazy
* 2.43 GB po imporcie danych

##### DYSK

![alt tag](https://github.com/kropeq/baranki/blob/master/images/import_DYSK.png)




### Agregacja 1: Najczęściej nadawane imiona w Stanach Zjednoczonych w latach 1910-2014

Aby uzyskać 10 najczęściej nadawanych imion dla dziecka w tym okresie, korzystamy z następującej agregacji:

```js
db.names.aggregate(
	{ $group: { 
		_id: { Gender: "$Gender", Name: "$Name" }, 
		Number: { $sum: "$Count" } 
	}}, 
	{ $sort: { Number: -1 }
	}, 
	{ $limit: 10 }
)
```

Wynik:

```json
{ "_id" : { "Gender" : "M", "Name" : "James" }, "Number" : 4938965 }
{ "_id" : { "Gender" : "M", "Name" : "John" }, "Number" : 4829733 }
{ "_id" : { "Gender" : "M", "Name" : "Robert" }, "Number" : 4710600 }
{ "_id" : { "Gender" : "M", "Name" : "Michael" }, "Number" : 4295779 }
{ "_id" : { "Gender" : "M", "Name" : "William" }, "Number" : 3829026 }
{ "_id" : { "Gender" : "F", "Name" : "Mary" }, "Number" : 3730856 }
{ "_id" : { "Gender" : "M", "Name" : "David" }, "Number" : 3554102 }
{ "_id" : { "Gender" : "M", "Name" : "Richard" }, "Number" : 2529952 }
{ "_id" : { "Gender" : "M", "Name" : "Joseph" }, "Number" : 2479602 }
{ "_id" : { "Gender" : "M", "Name" : "Charles" }, "Number" : 2244617 }
```

Powyższa agregacja jest zbudowana z kilku operatorów:

* ```$group``` - wymaga pola __id_, w którym wyznaczamy po jakich polach grupujemy, a pole _Number_ korzysta z funkcji agregacji ```$sum```, która zsumowuje liczbę nadanych tych samych imion poszczególnych płci po polu _Name_
* ```$sort``` - opiera się o wcześniej utworzone pole _Number_ i sortuje malejąco względem tej kolumny
* ```$limit``` - ograniczamy liczbę rekordów wynikowych do 10

#### Wnioski

Jak łatwo zauważyć na 10 najpopularniejszych imion aż 9 z nich są to imiona męskie. Oznacza to, iż chłopcom znacznie częściej nadawane zostają pospolite imiona niż dziewczynkom.


### Agregacja 2: Znalezienie okresu największej popularności wybranych imion

Agregacja ta posłuży nam do wyciągnięcia potrzebnych danych by móc stworzyć wykres wpływu ważnych osobistości na wybierane imiona dla dzieci.

#### Imię "Woodrow"

```js
db.names.aggregate( 
	{ $match: { Name: "Woodrow" } },
	{ $group: {
		_id: { Year: "$Year" },
		Number: { $sum: "$Count" }
	}},
	{ $sort: { "_id.Year" : 1}},
	{ $out : "agr1" }
)
```

Wynik:

```json
{ "_id" : { "Year" : 1910 }, "Number" : 11 }
{ "_id" : { "Year" : 1911 }, "Number" : 82 }
{ "_id" : { "Year" : 1912 }, "Number" : 1826 }
{ "_id" : { "Year" : 1913 }, "Number" : 2314 }
{ "_id" : { "Year" : 1914 }, "Number" : 1747 }
{ "_id" : { "Year" : 1915 }, "Number" : 1941 }
{ "_id" : { "Year" : 1916 }, "Number" : 2645 }
{ "_id" : { "Year" : 1917 }, "Number" : 2422 }
{ "_id" : { "Year" : 1918 }, "Number" : 3337 }
{ "_id" : { "Year" : 1919 }, "Number" : 1791 }
{ "_id" : { "Year" : 1920 }, "Number" : 733 }
...
```

#### Eksport wyniku zapytania do pliku CSV
```mongoexport -d baranki -c agr1 -f _id.Year,Number --csv > agr1.csv```

![Zobacz plik csv](https://github.com/kropeq/baranki/blob/master/data/agr1.csv)

#### Wynik zapytania przedstawiony na wykresie

![alt tag](https://github.com/kropeq/baranki/blob/master/images/woodrow.PNG)

#### Wnioski
Imię Woodrow zaczęło być popularne od 1913 roku (2314 dzieci), kiedy to urząd prezydenta Stanów Zjednoczonych objął Woodrow Wilson. Natomiast największą popularnością cieszyło się w roku 1918 (3337 dzieci). Można przypuszczać, że dlatego, iż właśnie w tym roku prezydent Wilson wsławił się wygłaszając na konferencji w Wersalu swój program pokojowy, słynne 14 punktów Wilsona, które stały się podstawą traktatu wersalskiego.

#### Imię "Franklin"

```js
db.names.aggregate( 
	{ $match: { Name: "Franklin" } },
	{ $group: {
		_id: { Year: "$Year" },
		Number: { $sum: "$Count" }
	}},
	{ $sort: { "_id.Year" : 1}},
	{ $out : "agr2" }
)
```

Wynik:

```json
{ "_id" : { "Year" : 1910 }, "Number" : 113 }
{ "_id" : { "Year" : 1911 }, "Number" : 173 }
{ "_id" : { "Year" : 1912 }, "Number" : 456 }
{ "_id" : { "Year" : 1913 }, "Number" : 562 }
{ "_id" : { "Year" : 1914 }, "Number" : 740 }
{ "_id" : { "Year" : 1915 }, "Number" : 967 }
{ "_id" : { "Year" : 1916 }, "Number" : 1053 }
{ "_id" : { "Year" : 1917 }, "Number" : 1164 }
{ "_id" : { "Year" : 1918 }, "Number" : 1257 }
{ "_id" : { "Year" : 1919 }, "Number" : 1186 }
{ "_id" : { "Year" : 1920 }, "Number" : 1435 }
...
```

Powyższa agregacja jest zbudowana z kilku operatorów:

* ```$match``` - wybiera z bazy tylko te rekordy, które zawierają w polu _Name_ słowo _Franklin_
* ```$group``` - wymaga pola __id_, w którym wyznaczamy po jakich polach grupujemy, a pole _Number_ korzysta z funkcji agregacji ```$sum```, która zsumowuje liczbę nadanych tych samych imion poszczególnych płci po polu _Name_
* ```$sort``` - służy do ustawienia rekordów w kolejności rosnącej względem lat z pola _Year_
* ```$out``` - wyniki tej agregacji zostają umieszczone w nowej kolekcji _agr2_

#### Eksport wyniku zapytania do pliku CSV
```mongoexport -d baranki -c agr2 -f _id.Year,Number --csv > agr2.csv```

![Zobacz plik csv](https://github.com/kropeq/baranki/blob/master/data/agr2.csv)

#### Wynik zapytania przedstawiony na wykresie

![alt tag](https://github.com/kropeq/baranki/blob/master/images/franklin.PNG)

#### Wnioski
Franklin Delano Roosevelt objął urząd prezydenta Stanów Zjednoczonych w 1933 roku. Możemy zauważyć, że to właśnie w tym roku jego imię było najbardziej popularne wśród noworodków. Dostało je bowiem aż 5355 dzieci. Wysoka tendencja utrzymała się również w roku następnym (4144). 

#### Imię "Elvis"

```js
db.names.aggregate( 
	{ $match: { Name: "Elvis" } },
	{ $group: {
		_id: { Year: "$Year" },
		Number: { $sum: "$Count" }
	}},
	{ $sort: { "_id.Year" : 1}},
	{ $out : "agr3" }
)
```
Wynik:

```json
{ "_id" : { "Year" : 1912 }, "Number" : 20 }
{ "_id" : { "Year" : 1913 }, "Number" : 6 }
{ "_id" : { "Year" : 1914 }, "Number" : 28 }
{ "_id" : { "Year" : 1915 }, "Number" : 51 }
{ "_id" : { "Year" : 1916 }, "Number" : 41 }
{ "_id" : { "Year" : 1917 }, "Number" : 50 }
{ "_id" : { "Year" : 1918 }, "Number" : 67 }
{ "_id" : { "Year" : 1919 }, "Number" : 73 }
{ "_id" : { "Year" : 1920 }, "Number" : 53 }
{ "_id" : { "Year" : 1921 }, "Number" : 69 }
{ "_id" : { "Year" : 1922 }, "Number" : 86 }
...
```

#### Eksport wyniku zapytania do pliku CSV
```mongoexport -d baranki -c agr3 -f _id.Year,Number --csv > agr3.csv```

![Zobacz plik csv](https://github.com/kropeq/baranki/blob/master/data/agr3.csv)

#### Wynik zapytania przedstawiony na wykresie

![alt tag](https://github.com/kropeq/baranki/blob/master/images/elvis.PNG)

#### Wnioski
Jak możemy zauważyć największy skok popularności imienia Elvis przypada na rok 1956 (z 26 w roku 1955 do 389 w roku 1956), a to dlatego, że właśnie w latach 1955-1956 muzyka Elvisa Presleya, znanego amerykańskiego piosenkarza, zaczęła być rozpoznawana na całym świecie. W latach 70 był on już gwiazdą międzynarodową, stąd większe powodzenie w nadawaniu tego imienia dzieciom niż przed narodzeniem „Króla Rock and Rolla”. Na uwagę zasługuje też fakt nagłego wzrostu popularności imienia Elvis w latach 1977-1978, gdyż wtedy właśnie Elvis Presley zmarł.

### Agregacja 3: Średnia roczna urodzeń dziewczynek i chłopców w Stanach Zjednoczonych w latach 1910-2014

Podobno statystycznie na 100 mężczyzn przypada 108 kobiet. Postanowiliśmy sprawdzić czy znajduje to odzwierciedlenie w naszym zbiorze.

|Płeć|Teoria|Nasz zbiór|
|:---:|:---:|:----------:|
|Dziewczynki|108|?|
|Chłopcy|100|?|

#### Średnia roczna urodzeń danej płci

Aby uzyskać średnią urodzeń płci męskiej i damskiej w celu sprawdzenia powyższej teorii, korzystamy z następującej agregacji:

```js
db.names.aggregate( 
	{ $group: {
		_id: { Gender: "$Gender", Year: "$Year" },
		Suma: { $sum: "$Count" }
	}},
	{ $group: {
		_id: { Gender: "$_id.Gender" },
		Average: { $avg: "$Suma" }
	}},
	{ $sort: { "Average" : -1}}
)
```

Wynik:

```json
{ "_id" : { "Gender" : "M"}, "Average" : 1477269.0571428572 }
{ "_id" : { "Gender" : "F"}, "Average" : 1369238.8095238095 }
```

Powyższa agregacja jest zbudowana z kilku operatorów:

* ```$group``` - pierwsze grupowanie wymaga pola __id_, grupuje względem pól _Gender_ oraz _Year_, a pole _Suma_ korzysta z funkcji agregacji ```$sum```, która zsumowuje liczbę nadanych kobiecych i męskich imion w poszczególnych latach po polu _Count_
* ```$group``` - drugie grupowanie również wymaga pola __id_, na bazie wyniku poprzedniego grupowania grupuje względem pola __id.Gender_ i za pomocą funkcji agregacji ```$avg``` wylicza średnią ze zliczonych sum dla poszczególnych płci.
* ```$sort``` - opiera się o wcześniej utworzone pole _Average_ i sortuje malejąco względem tego pola

#### Wnioski
Założeniem tej agregacji było sprawdzenie czy teoria o rodzeniu się większej ilości kobiet niż mężczyzn jest prawdziwa i czy stosunek tych urodzeń jest podobny jak w teorii, czyli 100 mężczyzn do 108 kobiet. W wyniku otrzymaliśmy ~1 477 269 mężczyzn do ~1 369 239 kobiet rocznie. Wynik ten pokazuje, iż jeśli ta teoria jest prawdziwa, to nie znajduje ona pokrycia w Stanach Zjednoczonych, gdyż proporcje wyszły odwrotne, około 108 urodzonych chłopców przypada na 100 urodzonych dziewczynek.

|Płeć|Teoria|Nasz zbiór|
|:---:|:---:|:----------:|
|Dziewczynki|108|100|
|Chłopcy|100|108|


### Agregacja 4: Top 2-6 najczęściej nadawanych imion męskich zaczynających się literą "M".

Do sprawdzenia powyższego zagadnienia posłuży nam agregacja:

```js
db.names.aggregate(
	{ $match: {
		$and: [{
			Name: {	$regex: new RegExp(/^M/) },
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
)
```

Wynik:


```json
{ "_id" : { "Name" : "Matthew"}, "Suma" : 1548424 }
{ "_id" : { "Name" : "Mark"}, "Suma" : 1339737 }
{ "_id" : { "Name" : "Martin"}, "Suma" : 290519 }
{ "_id" : { "Name" : "Marvin"}, "Suma" : 242835 }
{ "_id" : { "Name" : "Melvin"}, "Suma" : 234118 }
```

Powyższa agregacja jest zbudowana z kilku operatorów:

* ```$match``` - wybiera z bazy tylko te rekordy, których pole _Name_ zaczyna się od litery _M_ oraz płeć jest _M_
* ```$group``` - grupowanie wymaga pola __id_, na bazie wyniku poprzedniego ograniczania grupuje względem pola _Name_ i za pomocą funkcji agregacji ```$sum``` zlicza ilość nadanych imion zapisując pod nowe pole _Suma_
* ```$sort``` - opiera się o wcześniej utworzone pole _Suma_ i sortuje malejąco względem tego pola
* ```$limit``` - ogranicza liczbę zwracanych rekordów do 6
* ```$skip``` - pomija pierwszy rekord nieistotny z punktu widzenia założenia wyszukiwania


### Agregacja 5: Liczba urodzeń w kolejnych latach przedziału 1910-2014 w Stanach Zjednoczonych

W agregacji tej chcemy sprawdzić jak kształtuje się liczba urodzeń na tle ubiegłych lat. Jest niż demograficzny czy może wyż?

Do rozwiązania tego pytania użyjemy agregacji:

```js
db.names.aggregate(
	{ $group: { 
		_id: { 
			Year: "$Year"}, 
			Number: { 
				$sum: "$Count"} 
	}}, 
	{ $sort: { "_id.Year": 1 } },
	{ $out: "agr5" }
)
```

Wynik:

```json
{ "_id" : { "Year" : 1910 }, "Number" : 516318 }
{ "_id" : { "Year" : 1911 }, "Number" : 565810 }
{ "_id" : { "Year" : 1912 }, "Number" : 887984 }
{ "_id" : { "Year" : 1913 }, "Number" : 1028553 }
{ "_id" : { "Year" : 1914 }, "Number" : 1293322 }
{ "_id" : { "Year" : 1915 }, "Number" : 1690022 }
{ "_id" : { "Year" : 1916 }, "Number" : 1786510 }
{ "_id" : { "Year" : 1917 }, "Number" : 1855696 }
{ "_id" : { "Year" : 1918 }, "Number" : 2013381 }
{ "_id" : { "Year" : 1919 }, "Number" : 1954834 }
{ "_id" : { "Year" : 1920 }, "Number" : 2101157 }
...
```

#### Wynik zapytania przedstawiony na wykresie

![alt tag](https://github.com/kropeq/baranki/blob/master/images/agr5.PNG)

## Python

1. Najczęściej nadawane imiona w Stanach Zjednoczonych w latach 1910-2014

```python
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
```

2. Znalezienie okresu największej popularności wybranych imion

a) Woodrow

```python
import pymongo
from pymongo import MongoClient
client = MongoClient()

db = client['baranki']
collection = db['names']

pipeline = [
	{ "$match": { "Name": "Woodrow" } },
	{ "$group": {
		"_id": { "Year": "$Year" },
		"Number": { "$sum": "$Count" }
	}},
	{ "$sort": { "_id.Year" : 1}}
]
 
zapytanie = db.names.aggregate(pipeline)

for doc in zapytanie:
   print(doc)
```

3. Średnia roczna urodzeń dziewczynek i chłopców w Stanach Zjednoczonych w latach 1910-2014

```python
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
```

5. Liczba urodzeń w kolejnych latach przedziału 1910-2014 w Stanach Zjednoczonych

```python
import pymongo
from pymongo import MongoClient
client = MongoClient()

db = client['baranki']
collection = db['names']

pipeline = [
	{ "$group": { 
		"_id": { 
			"Year": "$Year"}, 
			"Number": { 
				"$sum": "$Count"} 
	}}, 
	{ "$sort": { "_id.Year": 1 } }
]
 
zapytanie = db.names.aggregate(pipeline)

for doc in zapytanie:
   print(doc)
```
