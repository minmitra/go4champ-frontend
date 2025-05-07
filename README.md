Developer-Dokumentation – Projektstart

Einheitliches Setup für alle Teammitglieder
  verwendete Versionen
IntelliJ IDEA( 2025.1) 
Java JDK 17  (Java JDK 17: 24.0.1)
h2 (2024-08-11)
Git (2.49.0)
Node.js (v23.11.0)
Node Package Manager (1cs0.9.2)
Spring Boot (3.4.4)
Maven (3.9.9)

1.Allgemein
1.1.IntelliJ IDEA installieren (Version: )
Download: https://www.jetbrains.com/idea/download

1.2.Git installieren und  Projekt starten (Version: 2.49.0)
Windows/macOS/Linux: https://git-scm.com/downloads

1.3.Java JDK 17 installieren (Java JDK 17: 24.0.)
Windows:
Offizielle Oracle-Version herunterladen: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
Mit MacOS
brew install temurin
Mit Linux
sudo apt update
sudo apt install openjdk-17-jdk

2.Backend 
2.1. Maven installieren:
 installieren:
MacOS
brew install maven
Linux
sudo apt update
sudo apt install maven
Windows
https://maven.apache.org/download.cgi

2.2. H2 und Swagger API  konfigurieren  (nur eine Person im Team) :
    src/main/resources/application.yml

spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driverClassName: org.h2.Driver
    username: sa
    password:
  h2:
    console:
      enabled: true
  jpa:
    hibernate:
      ddl-auto: update

springdoc:
  swagger-ui:
    path: /swagger-ui.html

2.3 Abhängigkeit in pom.xml (Falls nicht  im Projekt vorhanden ist, nur eine Person  im Team)
<dependency>
  <groupId>com.h2database</groupId>
  <artifactId>h2</artifactId>
  <scope>runtime</scope>
</dependency>

2.4. H2-Konsole im Browser öffnen:????

2.5 Backend starten
Spring Boot  starten:
mvn spring-boot:run

3.Frontend 
3.1.Node.js installieren und testen: 
Windows/macOS/Linux: https://nodejs.org/    
Nach Installation testen(node  v23.11.0 und Node npm 10.9.2):
node -v
npm -v

3.2. React-Projekt erstellen (nur eine Person im Team):
 Bsp. im Ordner frontend 
npx create-react-app frontend

3.3.Projekt starten im Frontend-Ordner:
npm install     # lädt alle benötigten Pakete
npm start       # startet die React-App

