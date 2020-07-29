import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.sevice';
import { NavController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin = true;
  isLoading = false;
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin() {
    this.authService.login();
    this.isLoading = true;
    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Logging In ...'
    }).then(loadingEl => {
      loadingEl.present();
      setTimeout(() => {
        this.isLoading = false;
        loadingEl.dismiss();
        this.navCtrl.navigateForward('/places/tabs/find');
      }, 1500);
    });
  }

  onSwitch() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log(form);

    const email = form.value.email;
    const password = form.value.password;
    if (this.isLogin) {

    } else {

    }
  }

}
