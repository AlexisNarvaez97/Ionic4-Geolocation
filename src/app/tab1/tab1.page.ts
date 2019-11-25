import { Component, OnInit } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page implements OnInit {

  latitud: any;

  longitud: any;

  constructor(private geo: Geolocation) {}

  ngOnInit() {}

  getLoca() {
    this.geo.getCurrentPosition().then(resp => {

      // this.latitud = resp.coords.latitude;
      // this.longitud = resp.coords.longitude;

      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);
      // console.log(resp);
    });
  }

  watchLoca() {
    const suscription = this.geo.watchPosition();

    suscription.subscribe( coords => {
      this.latitud = coords.coords.latitude;
      this.longitud = coords.coords.longitude;
      console.log('Coords', coords);
    });
  }
}
