import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.sevice';

@Component({
  selector: 'app-find',
  templateUrl: './find.page.html',
  styleUrls: ['./find.page.scss'],
})
export class FindPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  virtualList: Place[];
  subs: Subscription;
  sub2: Subscription;
  isLoading = false;
  relevantPlaces: Place[];
  private filter = 'all';

  constructor(
    private placesServ: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // this.isLoading = true;
    this.subs = this.placesServ.places.subscribe(places => {
      this.loadedPlaces = places;
      this.onFilter(this.filter);
      // this.isLoading = false;
      // this.relevantPlaces = this.loadedPlaces;
      // this.virtualList = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.sub2 = this.placesServ.fetchPlaces().subscribe(()=>{
      this.isLoading = false;
    });
  }

  onFilter(filter: string) {
    const isShown = (place: Place) => filter === 'all' || place.userId !== this.authService.userId;
    this.relevantPlaces = this.loadedPlaces.filter(isShown);
    this.virtualList = this.relevantPlaces.slice(1);
    this.filter = filter;
    // if (event.detail.value === 'all') {
    //   this.relevantPlaces = this.loadedPlaces;
    //   this.virtualList = this.relevantPlaces.slice(1);
    // } else {
    //   this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== this.authService.userId);
    //   this.virtualList = this.relevantPlaces.slice(1);
    // }
  }

  // onOpenMenu(){
  //   this.menuCtrl.toggle('m1');
  // }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
    if(this.sub2){
      this.sub2.unsubscribe();
    }
  }

}
