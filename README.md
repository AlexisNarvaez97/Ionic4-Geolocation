# Aplicacion - Geolocation


Reconstruir el proyecto
```
npm install
```

Configuración resources > android > xml > network_security_config.xml
```
<domain includeSubdomains="true">"Tu ip para hacer pruebas"</domain> <!-- 192.169.3.123 EJEMPLO -->
```
[![Image from Gyazo](https://i.gyazo.com/a98728aa74d1d3e7b6a8fd6cc1dc328a.png)](https://gyazo.com/a98728aa74d1d3e7b6a8fd6cc1dc328a)

Agregar configuracion a app.module.ts
```
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";


const config: SocketIoConfig = { url: "http://'ip':5000", options: {} }; // ip ejemplo : 192.168.1.23 // Esta configuración es para hacer pruebas en el dispositivo fisico                                                    apuntando al servidor local.

imports: [
  SocketIoModule.forRoot(config)
]
```

[![Image from Gyazo](https://i.gyazo.com/3a661226f517a8b788d5337e754eb893.png)](https://gyazo.com/3a661226f517a8b788d5337e754eb893)


Peticion GET a REST

```
 this.http.get<RespMarcadores>("http://'ip':5000/mapa") .subscribe(lugares => { clg(lugares)} );

 // IP ejemplo : 192.168.1.23 // Esta configuración es para hacer pruebas en el dispositivo fisico                                                   apuntando al servidor local.
```

[![Image from Gyazo](https://i.gyazo.com/b5ed6c0a6ab5054946034020b6b1f105.png)](https://gyazo.com/b5ed6c0a6ab5054946034020b6b1f105)