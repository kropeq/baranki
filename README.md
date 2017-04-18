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

#### Kobiece imiona

Aby uzyskać 10 najczęściej nadawanych kobiecych imion dla dziecka, korzystamy z następującej agregacji:

```js
db.names.aggregate(
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
{ "_id" : { "Gender" : "F", "Name" : "Dorothy" }, "Number" : 1051603 }
{ "_id" : { "Gender" : "F", "Name" : "Jessica" }, "Number" : 1038060 }
```

Powyższa agregacja jest zbudowana z kilku operatorów:

* ```$group``` - wymaga pola __id_, w którym wyznaczamy po jakich polach grupujemy, a pole _Number_ korzysta z funkcji agregacji ```$sum```, która zsumowuje liczbę nadanych tych samych imion poszczególnych płci po polu _Name_
* ```$sort``` - opiera się o wcześniej utworzone pole _Number_ i sortuje malejąco względem tej kolumny
* ```$match``` - korzysta z grupowanego pola _Gender_ i wybiera za pomocą funkcji ```$regex``` rekordy zawierające słowo _F_ w polu _Gender_
* ```$limit``` - ograniczamy liczbę rekordów wynikowych do 10


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
