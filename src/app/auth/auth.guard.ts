import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.sevice';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private navCtrl: NavController) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isAuthenticated) {
      this.navCtrl.navigateBack('/auth');
      return;
    }
    return this.authService.isAuthenticated;
  }

}
