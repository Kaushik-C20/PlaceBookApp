import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { take, tap, delay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.sevice';

@Injectable({ providedIn: 'root' })
export class BookingService {

    constructor(private authService: AuthService) { }

    private _bookings = new BehaviorSubject<Booking[]>([]);

    get bookings() {
        return this._bookings.asObservable();
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date
    ) {
        const newBooking = new Booking(
            Math.random().toString(),
            placeId,
            this.authService.userId,
            placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo
        );
        return this.bookings.pipe(take(1),delay(1000),tap(bookings => {
            this._bookings.next(bookings.concat(newBooking));
        }));
    }

    cancelBooking(bookingId: string) {
        return this.bookings.pipe(take(1),delay(1000),tap(bookings => {
            this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
        }));
    }
}