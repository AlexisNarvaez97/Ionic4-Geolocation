import { Component, OnInit } from "@angular/core";

import * as mapboxgl from "mapbox-gl";
import { WebsocketService } from "../services/websocket.service";
import { Lugar } from "../interfaces/interfaces";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { HttpClient } from "@angular/common/http";

interface RespMarcadores {
  [key: string]: Lugar;
}

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page implements OnInit {
  mapa: mapboxgl.Map;

  markersMapbox: { [id: string]: mapboxgl.Marker } = {};

  lugares: RespMarcadores = {};

  constructor(
    private wsService: WebsocketService,
    private geo: Geolocation,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.http
      // tslint:disable-next-line: max-line-length
      .get<RespMarcadores>("http://'ip':5000/mapa") // ip ejemplo : 192.168.1.23 // Esta configuración es para hacer pruebas en el dispositivo fisico                                                    apuntando al servidor local.
      .subscribe(lugares => {
        this.lugares = lugares;
        // console.log(lugares);
        this.crearMapa();
      });
    this.escucharSockets();
  }

  escucharSockets() {
    // marcador nuevo
    this.wsService.listen("marcador-nuevo").subscribe((marcador: Lugar) => {
      console.log("Socket");
      console.log(marcador);

      this.agregarMarcador(marcador);
    });

    // marcador mover
    this.wsService.listen("mover-marcador").subscribe((marcador: Lugar) => {
      console.log("Socket");
      console.log(marcador);

      // Referencia al marker por medio del id y cambiando la lng y lat.
      this.markersMapbox[marcador.id].setLngLat([marcador.lng, marcador.lat]);
    });

    // marcador borrar

    this.wsService.listen("borrar-marcador").subscribe((id: string) => {
      console.log("Socket");
      console.log(id);
      // Borrar el marcador por la instancia del marker de mapbox ()=> REMOVE() y de lugares.
      this.markersMapbox[id].remove();
      // Borrar la posición del objeto.
      delete this.markersMapbox[id];
    });
  }

  crearMapa() {
    (mapboxgl as any).accessToken = ""; // TOKEN DE MAPBOX.
    this.mapa = new mapboxgl.Map({
      container: "mapa",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0], // [lng, lat] - Al lugar, ciudad que quieras apuntar el mapa.
      zoom: 16 // Dependiendo las pruebas.
    });

    // Iterable para objetos.
    for (const [id, marcador] of Object.entries(this.lugares)) {
      // console.log(id, marcador);
      this.agregarMarcador(marcador);
    }
  }

  agregarMarcador(marcador: Lugar) {
    // TODO: Fix a los estilos del DOM.

    const h2 = document.createElement("h2");
    h2.innerText = marcador.nombre;

    const btnBorrar = document.createElement("button");
    btnBorrar.innerText = "Borrar";

    const div = document.createElement("div");
    div.append(h2, btnBorrar);

    const customPopup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false
    }).setDOMContent(div);

    const marker = new mapboxgl.Marker({
      draggable: true,
      color: marcador.color
    })
      .setLngLat([marcador.lng, marcador.lat])
      .setPopup(customPopup)
      .addTo(this.mapa);

    marker.on("drag", () => {
      const lngLat = marker.getLngLat();
      // console.log(lngLat);

      const suscription = this.geo.watchPosition();

      suscription.subscribe(data => {
        const nuevoMarcador = {
          id: marcador.id,
          lng: data.coords.longitude,
          lat: data.coords.latitude
        };
        // console.log(nuevoMarcador);
        // TODO: crear evento para emitir las coordenadas de este marcador.
        this.wsService.emit("mover-marcador", nuevoMarcador);
      });
    });

    btnBorrar.addEventListener("click", () => {
      marker.remove();

      // TODO: Eliminar el marcador mediante sockets.
      this.wsService.emit("borrar-marcador", marcador.id);
    });

    this.markersMapbox[marcador.id] = marker;
    console.log(this.markersMapbox);
  }

  crearMarcador() {
    this.geo.getCurrentPosition().then(data => {
      console.log(data);

      // const lng = data.coords.longitude;
      // const lat = data.coords.longitude;

      const customMarket: Lugar = {
        id: new Date().toISOString(),
        lng: data.coords.longitude,
        lat: data.coords.latitude,
        nombre: "Sin Nombre",
        color: "#" + Math.floor(Math.random() * 16777215).toString(16)
      };

      this.agregarMarcador(customMarket);

      this.wsService.emit("marcador-nuevo", customMarket);
    });

    // const customMarker: Lugar = {
    //   id: new Date().toISOString(),
    //   lng: -75.75512993582937,
    //   lat: 45.349977429009954,
    //   nombre: "Sin Nombre",
    //   color: "#" + Math.floor(Math.random() * 16777215).toString(16)
    // };
  }
}
