import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Place } from 'src/app/places/place.model';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

  @Input() selPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  startDate: string;
  endDate: string;
  @ViewChild('form', { static: true }) form: NgForm;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selPlace.availableFrom);
    const availableTo = new Date(this.selPlace.availableTo);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(availableFrom.getTime() + Math.random() * (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())).toISOString();
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString();
    }
  }

  cancel() {
    this.modalCtrl.dismiss({ message: 'Canceled' }, 'cancel');//to 'modal1' Modalcomp
  }

  bookPlace() {
    if (!this.form.valid || !this.validDate) {
      return;
    }
    this.modalCtrl.dismiss({
      bookingData: {
        firstName: this.form.value['first-name'],
        lastName: this.form.value['last-name'],
        guestNum: +this.form.value['guest-num'],
        startDate: new Date(this.form.value['date-from']),
        endDate: new Date(this.form.value['date-to'])
      }
    }, 'confirm');
    // , 'modal1')
  }

  validDate() {
    const startdate = new Date(this.form.value['date-from']);
    const enddate = new Date(this.form.value['date-to']);
    return enddate > startdate;
  }

}
