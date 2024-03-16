KMS WiSe 2023 | MyCargonaut | Anastasia, Elisa, Jimmy, Jonas, Julius, Steffen, Vincent

<img src="frontend/src/assets/img/Logo.png"  width="500px" />


## Toolstack
Frontend: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [React Bootstrap](https://react-bootstrap.netlify.app/)

Backend: [NestJs](https://nestjs.com/), [TypeORM](https://typeorm.io/)

Andere: GitHub, [Figma](https://www.figma.com/), [Docker](https://www.docker.com/), [Node.js](https://nodejs.org/en), [Dependabot](https://github.com/dependabot)


## Funktionen

>### Registrieren & Login
> Nutzer können sich auf der Webseite registrieren. Dabei wird überprüft, ob der Nutzer bereits existiert und mindestens 18 Jahre alt ist.
>
> Das Passwort wird nach den aktuellen Standards gehasht, um die Sicherheit zu gewährleisten.
> 
> ..


>### Profilansicht
> some content...
>
> some content...

>### Benutzer-/Fahrzeugverwaltung
> some content...
>
> some content...

>### Angebot/Gesuch erstellen
> Sobalt Nutzer ihre Handynummer eingefügt haben (diese wird Validiert) können sie eigene Angebote (Fahrten) einstellen. 
>
> some content...

>### Kommunikation
> some content...
>
> some content...

>### Preisgestaltung
> some content...
>
> some content...

>### Bewertung
> some content...
>
> some content...


## Development

Der Server kann nur auf ein build zugreifen. Jede änderung im React Code wird erst nach einem ausführen des Build Scripts gültig.
```bash
cd frontend
npm run build
```


Server Starten:
```bash
cd backend
npm run start:dev
```
___
Öffnen auf: http://localhost:3000

API Doku: http://localhost:3000/api/

Deployment: http://85.215.49.94:8000/ | Nutzer: test | PW: 1234

Klassendiagramm:  [`documentation/???`](documentation/???)

Domainmodell:  [`documentation/domainmodell.svg`](documentation/domainmodell.svg)

Style Guide:  [`documentation/style-guide/`](documentation/style-guide/)
___
Es muss für jeden Request und jeden Response ein DTO erstellt werden, damit die Swagger API funktioniert :smiling_face_with_tear:

<img src="https://media.tenor.com/Opkrr0Wd2VAAAAAd/struggle-crying.gif"  width="200" />

