KMS WiSe 2023 | MyCargonaut | Anastasia, Elisa, Jimmy, Jonas, Julius, Steffen, Vincent

<img src="frontend/src/assets/img/Logo.png"  width="500px" />


## Toolstack
Frontend: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [React Bootstrap](https://react-bootstrap.netlify.app/)

Backend: [NestJs](https://nestjs.com/), [TypeORM](https://typeorm.io/)

Andere: GitHub, [Figma](https://www.figma.com/), [Docker](https://www.docker.com/), [Node.js](https://nodejs.org/en), [Dependabot](https://github.com/dependabot)


ER Diagram:  [`documentation/ERDiagram.png`](documentation/ERDiagram.png)

Domainmodell:  [`documentation/domainmodell.svg`](documentation/domainmodell.svg)

Style Guide:  [`documentation/style-guide/`](documentation/style-guide/)


## Die Software starten

### Dev Start
1. Clonen

2. Frontend dependencies installieren und bauen
```bash
cd frontend
npm install
npm run build
```

3. Backend dependencies installieren und starten:
```bash
cd backend
npm install
npm run start:dev
```

Öffnen auf: http://localhost:3000

API Doku: http://localhost:3000/api/


### Docker Compose Start
1. Clonen
2. `docker compose up -d`

Öffnen auf: http://localhost:8000/ | Nutzer: test | PW: 1234

API Doku: http://localhost:8000/api/

___
### Deployment (nicht funktional)

Deployment : http://85.215.49.94:8000/ | Nutzer: test | PW: 1234


## Funktionen
Ein grober überblick

### Unit Tests
Für jede Funktion in backend Controllern und Services wurden ausreichend sinnvolle Tests geschrieben, die (so wie das linten) in der CD-Pipe ausgeführt werden.

### Websockets
Für ein flüssigeres Nutzungserlebnis wurden im Bereich des Chats Websockets implementiert.

### Registrieren
Um alle Funktionen der Plattform nutzen zu können, ist eine Registrierung erforderlich. Während des Registrierungsprozesses wird überprüft, ob der Benutzer das Mindestalter von 18 Jahren erreicht hat. Darüber hinaus wird das Passwort gemäß den aktuellen Sicherheitsstandards gehasht, um die Sicherheit zu gewährleisten und die Vertraulichkeit der Benutzerdaten zu schützen.

### Login
Wenn ein Benutzer bereits registriert ist, kann er sich auf derselben Seite anmelden, indem er seine E-Mail-Adresse und sein Passwort eingibt. Bei Übereinstimmung wird er automatisch weitergeleitet. Andernfalls erhält er eine entsprechende Fehlermeldung.

### Fahrt/Cargo Suche
Der Nutzer kann in der Navigationsleiste auf "Fahrt suchen" oder "Cargo suchen" navigieren, um auf eine Seite zu gelangen, auf der alle eingestellten Angebote und Gesuche angezeigt werden. Darüber hinaus stehen verschiedene Filteroptionen zur Verfügung, wie z.B. das Start- und Zielort, Anzahl der Sitze, Datum oder Bewertung, sowie eine Textsuche. Durch Klicken auf "Filter zurücksetzen" hat der Benutzer die Möglichkeit, seine Filter zu löschen und alle Angebote oder Gesuche erneut anzuzeigen. Möchte der Benutzer weitere Informationen zu einem Angebot oder Gesuch erhalten, kann er einfach darauf klicken und wird auf die entsprechende Detailseite weitergeleitet.

### Profilansicht
In der Profilansicht sind sämtliche relevante Informationen zum Nutzer zu finden. Hier besteht die Möglichkeit, das eigene Profil zu bearbeiten. Darüber hinaus können Nutzer ihre aktuellen Coins, Bewertungen und weitere persönliche Angaben einsehen. Ebenso ist es möglich, Fahrzeuge anzulegen, die dann bei der Angebotserstellung angegeben werden können. Es wurde darauf geachtet, dass Benutzer erst Fahrten anbieten und erstellen können, sobald sie eine Telefonnummer und ein Profilbild hinterlegt haben. Die Profilansicht bietet zudem eine Übersicht über geplante Fahrten und Transporte sowie eigene Fahrzeuge und Bewertungen des Nutzers. Von hier aus können Nutzer auch alle Fahrten bewerten, an denen sie teilgenommen haben.

### Angebot und Gesuch einstellen
In der Profilansicht finden sich die Optionen "Fahrt anlegen" und "Gesuch anlegen". Klickt man auf eine dieser Optionen, öffnet sich das entsprechende Modal. Beim Anlegen einer Fahrt hat der Benutzer die Möglichkeit, eines seiner Fahrzeuge auszuwählen und damit eine Route zu erstellen, wobei die Plätze für die einzelnen Etappen per Drag-and-Drop verschoben werden können. Beim Anlegen eines Gesuches kann der Benutzer lediglich Start- und Zielorte angeben. Darüber hinaus können bei beiden Optionen weitere Informationen wie das Datum, die Anzahl der Sitzplätze und eine Beschreibung eingegeben werden. Bestätigt der Nutzer seine Eingabe wird das Angebot/Gesuch auf der Suchseite angezeigt, und andere Nutzer können es sehen.


