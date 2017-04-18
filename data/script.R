agr1 = read.csv("C:/Users/minio/Desktop/NOSQL/agr1.csv", header = TRUE)
 
plot(agr1, type="l",col="blue", xlab="Lata", ylab="Liczba imion", main="Woodrow")
axis(1,at=seq(1910,2010, by=10))
axis(2,at=seq(0,3500, by=500))
 
 
agr2 = read.csv("C:/Users/minio/Desktop/NOSQL/agr2.csv", header = TRUE)
 
plot(agr2, type="l",col="blue", xlab="Lata", ylab="Liczba imion", main="Franklin")
axis(1,at=seq(1910,2010, by=10))
axis(2,at=seq(0,5000, by=1000))
 
 
agr3 = read.csv("C:/Users/minio/Desktop/NOSQL/agr3.csv", header = TRUE)
 
plot(agr3, type="l",col="blue", xlab="Lata", ylab="Liczba imion", main="Elvis")
axis(1,at=seq(1910,2010, by=10))
 
 
agr5 = read.csv("C:/Users/minio/Desktop/NOSQL/agr5.csv", header = TRUE)
 
plot(agr5, type="l",col="blue", xlab="Lata", ylab="Ilosc dzieci", main="Liczba urodzeń w latach 1910-2014 w USA")
axis(1,at=seq(1910,2010, by=10))
