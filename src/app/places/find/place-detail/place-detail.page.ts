import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.sevice';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  subs: Subscription;
  isBookable = false;
  isLoading = false;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesServ: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingservice: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router:Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/find');
        return;
      }
      this.isLoading = true;
      this.subs = this.placesServ.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== this.authService.userId;
        this.isLoading = false;
      },err => {
        this.alertCtrl.create({
          header:'An error occurred',
          message:'Could not load the Page.',
          buttons:[
            {
              text:'Okay',handler: ()=>{
              this.router.navigateByUrl('/places/tabs/find');
              // this.alertCtrl.dismiss();
            }
          }]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  onBookPlace() {
    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'destructive'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });

    // this.router.navigateByUrl('/places/tabs/find');
    // this.navCtrl.navigateBack('/places/tabs/find');
    // this.navCtrl.pop();
  }

  openModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps: { selPlace: this.place, selectedMode: mode }
      // id: 'modal1'
    }).then(modElement => {
      modElement.present();
      return modElement.onDidDismiss(); 
      // returns Promise
    }).then(resultData => {
      if (resultData.role === 'confirm') {
        console.log(resultData.data);

        this.loadingCtrl.create({
          message: 'Booking Place...'
        }).then(loadingEl => {
          loadingEl.present();
          const data = resultData.data.bookingData;

          this.bookingservice.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageUrl,
            data.firstName,
            data.lastName,
            data.guestNum,
            data.startDate,
            data.endDate
          ).subscribe(()=>{
            loadingEl.dismiss();
          });
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}
