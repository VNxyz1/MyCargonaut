KMS WiSe 2023
# MyCargonaut

## Development

Der Server kann nur auf ein build zugreifen. Jede änderung im React Code wird erst nach einem ausführen des Build Scripts gültig.
```bash
cd frontent
npm run build
```


Server Starten:
```bash
cd backend
mpm run start:dev
```

Es muss für jeden Request und jeden Response ein DTO erstellt werden, damit die Swagger API funktioniert :smiling_face_with_tear:

<img src="https://media.tenor.com/Opkrr0Wd2VAAAAAd/struggle-crying.gif"  width="200" />


## Development

Über die package.json im "frontent" Ordner muss nach jeder Änderung an der REACT-APP das "build" script ausgeführt werden, um die Änderung gültig zu machen.

Alternativ:
```bash
cd frontent
npm run build
```


Der Server lässt sich ebenfalls über die package.json im backend Ordner Starten. Hierfür empfiehlt sich das script "start:dev".

Alternativ:
```bash
cd backend
mpm run start:dev
```

Es muss für jeden Request und jeden Response ein DTO erstellt werden, damit die Swagger API funktioniert. :smiling_face_with_tear:

<img src="https://media.tenor.com/Opkrr0Wd2VAAAAAd/struggle-crying.gif"  width="200" />


## Gruppe
Anastasia, Elisa, Jimmy, Jonas, Julius, Steffen, Vincent

