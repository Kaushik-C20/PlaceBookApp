import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation } from 'src/app/places/location.model';
import { of } from 'rxjs';

interface Coordinates {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImage: string;
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private http: HttpClient
  ) { }

  ngOnInit() { }

  onPickLoc() {
    this.modalCtrl.create({
      component: MapModalComponent
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (modalData.data) {
          return;
        }
        const pickedLocation: PlaceLocation = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
          address: null,
          staticMapImageUrl: null
        };
        this.isLoading = true;
        this.getAddress(modalData.data.lat, modalData.data.lng)
        .pipe(switchMap(address => {
          pickedLocation.address = address;
          return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14));
        })) // takes result of first one and returns a new Observable
        .subscribe((staticMapImageUrl)=>{
          pickedLocation.staticMapImageUrl = staticMapImageUrl;
          this.selectedLocationImage = staticMapImageUrl;
          this.isLoading = false;
          this.locationPick.emit(pickedLocation);
        });
      });
      modalEl.present();
    });
    // this.actionSheetCtrl.create({
    //   header: 'Please Choose',
    //   buttons: [
    //     {
    //       text: 'Auto-Location', handler: () => {
    //         this.locateUser();
    //       }
    //     },
    //     { text: 'Cancel', role: 'cancel' }
    //   ]
    // }).then(actionSheetEl => {
    //   actionSheetEl.present();
    // });
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleAPIkey}`)
      .pipe(map(geoData => {
        if(!geoData || !geoData.results || geoData.results.length === 0){
          return null;
        }
        return geoData.results[0].formatted_address;
      }));
  }

  // private locateUser() {
  //   if (!Capacitor.isPluginAvailable('Geolocation')) {
  //     this.showErrAlert();
  //     return;
  //   }
  //   Plugins.Geolocation.getCurrentPosition()
  //     .then(geoPosition => {
  //       const coordinates = { lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude };
  //       // this.createPlace(coordinates.lat, coordinates.lng);
  //     })
  //     .catch(err => {
  //       this.showErrAlert();
  //     });
  // }

  private getMapImage(lat: number, lng: number, zoom: number){
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleAPIkey}`;
  }


  private showErrAlert() {
    this.alertCtrl.create({
      header: "Could not fetch the location",
      message: 'Please try later!'
    }).then(alertEl => {
      alertEl.present();
    });
  }

}
