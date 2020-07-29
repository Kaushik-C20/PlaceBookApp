import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { Router } from '@angular/router';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit,OnDestroy {

  loadedPlaces: Place[] = [];
  subs: Subscription;
  sub2: Subscription;
  isLoading = false;

  constructor(private placesServ: PlacesService, private router: Router, private LoadingCtrl:LoadingController) { }

  ngOnInit() {
    this.subs = this.placesServ.places.subscribe(places => {
      this.loadedPlaces = places; 
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.sub2 = this.placesServ.fetchPlaces().subscribe(()=>{
      this.isLoading = false;
    });
  }

  onEdit(id: number, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', id]);
    console.log('Item ', id);
  }

  ngOnDestroy(){
    if(this.subs){
      this.subs.unsubscribe();
    }
    if(this.sub2){
      this.sub2.unsubscribe();
    }
  }

}
