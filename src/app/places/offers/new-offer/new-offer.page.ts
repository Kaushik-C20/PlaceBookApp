import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { NavController, LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.model';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  form: FormGroup;

  constructor(private placesService: PlacesService, private navCtrl: NavController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      datefrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateto: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      location: new FormControl(null, {validators: [Validators.required]})
    });
  }

  onLocationPicked(location: PlaceLocation){
    this.form.patchValue({location: location});
  }

  onImagePicked(imageData: string){}

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Adding Place...'
    }).then(loadel => {
      loadel.present();
      this.placesService.addPlace(
        this.form.value.title,
        this.form.value.description,
        +this.form.value.price,
        new Date(this.form.value.datefrom),
        new Date(this.form.value.dateto),
        this.form.value.location
      ).subscribe(() => {
        console.log(this.form);
        loadel.dismiss();
        this.form.reset();
        this.navCtrl.navigateBack('/places/tabs/offers');
      });
    });
  }

}
