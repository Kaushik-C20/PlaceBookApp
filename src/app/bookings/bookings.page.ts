import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { Subscription } from 'rxjs';
import { IonItemSliding, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit,OnDestroy {
  loadedBookings: Booking[];
  isLoading = false;
  subs: Subscription;
  sub2: Subscription;
  constructor(private bookingservice: BookingService,private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.subs = this.bookingservice.bookings.subscribe(bookingsList => {
      this.loadedBookings = bookingsList;
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.sub2 = this.bookingservice.fetchBookings().subscribe(()=>{
      this.isLoading = false;
    });
  }

  cancelBooking(bookingId: string,slidingItem: IonItemSliding) {
    slidingItem.close();
    this.loadingCtrl.create({
      message:'Cancelling Booking...'
    }).then(loadingEl => {
      loadingEl.present();
      this.bookingservice.cancelBooking(bookingId).subscribe(()=>{
        loadingEl.dismiss();
      });
    });
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
