import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.sevice';
import { HttpClient } from '@angular/common/http';

interface BookingData {
    bookedFrom: string;
    bookedTo: string;
    firstName: string;
    lastName: string;
    guestNum: string;
    placeId: string;
    placeImage: string;
    PlaceTitle: string;
    userId: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {

    constructor(private authService: AuthService, private http: HttpClient) { }

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
        let genId: string;
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
        return this.http.post<{ name: string }>("https://placebookingapp-4a6bc.firebaseio.com/bookings.json", { ...newBooking, id: null })
            .pipe(switchMap(responseData => {
                genId = responseData.name;
                return this.bookings;
            }), take(1), tap(bookings => {
                newBooking.id = genId;
                this._bookings.next(bookings.concat(newBooking));
            })
            );
    }

    fetchBookings() {
        return this.http.get<{ [key: string]: BookingData }>(`https://placebookingapp-4a6bc.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`)
            .pipe(map(bookingData => {
                const bookings = [];
                for (const key in bookingData) {
                    if (bookingData.hasOwnProperty(key)) {
                        bookings.push(new Booking(
                            key,
                            bookingData[key]['placeId'],
                            bookingData[key]['userId'],
                            bookingData[key]['placeTitle'],
                            bookingData[key]['placeImage'],
                            bookingData[key]['firstName'],
                            bookingData[key]['lastName'],
                            +bookingData[key]['guestNum'],
                            new Date(bookingData[key]['bookedFrom']),
                            new Date(bookingData[key]['bookedTo'])
                        )
                        );
                    }
                }
                return bookings;
            }), tap(bookings => {
                this._bookings.next(bookings);
            }));
    }

    cancelBooking(bookingId: string) {
        return this.http.delete(`https://placebookingapp-4a6bc.firebaseio.com/bookings/${bookingId}.json`)
            .pipe(switchMap(() => {
                return this.bookings;
            }), take(1), tap(bookings => {
                this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
            }));
    }
}