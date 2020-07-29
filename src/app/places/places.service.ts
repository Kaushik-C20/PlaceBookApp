import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.sevice';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

// new Place('p1', 'Grand Hotel', 'Very Famous for its wonderful beauty', 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Place_Jacobins_Lyon.jpg', 199.99, new Date('2020-02-01'), new Date('2020-12-31'), '2'),
// new Place('p2', 'New York Hotel', 'at the heart of NewYork City', 'https://images.adsttc.com/media/images/5caf/6fab/284d/d1e5/fc00/040d/newsletter/37367894112_c72c20b8e1_o.jpg?1555001231', 220.50, new Date('2020-02-01'), new Date('2020-12-31'), '1'),
// new Place('p3', 'Manhattan Building', 'at the center of Manhattan', 'https://img.delicious.com.au/ttEaxwsa/del/2018/12/new-york-usa-97371-2.jpg', 250.00, new Date('2020-02-01'), new Date('2020-12-31'), '2')


@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceData }>("https://placebookingapp-4a6bc.firebaseio.com/offered-places.json")
      .pipe(map(responseData => {
        const places: Place[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            places.push(new Place(key, responseData[key]['title'], responseData[key]['description'], responseData[key]['imageUrl'], responseData[key]['price'], new Date(responseData[key]['availableFrom']), new Date(responseData[key]['availableTo']), responseData[key]['userId']));
          }
        }
        return places;
      }), tap((places: Place[]) => { //tapping into the places
        this._places.next(places);
      }));
  }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return { ...places.find(place => place.id === id) };
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let genId: string;
    const newPlace = new Place(Math.random().toString(), title, description, 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Place_Jacobins_Lyon.jpg', price, dateFrom, dateTo, this.authService.userId);
    return this.http.post<{ name: string }>("https://placebookingapp-4a6bc.firebaseio.com/offered-places.json", { ...newPlace, id: null })
      .pipe(switchMap(responseData => {
        genId = responseData.name;
        return this.places;
      }), take(1), tap(places => {
        newPlace.id = genId;
        this._places.next(places.concat(newPlace));
      }));
    // return this.places.pipe(take(1), delay(1000), tap(places => {
    //   this._places.next(places.concat(newPlace));
    // }));
  }

  EditPlace(placeId: string, title: string, description: string) {
    let editedPlaces: Place[];
    return this.places.pipe(take(1), switchMap(places => {
      const index = places.findIndex(place => place.id === placeId);
      editedPlaces = [...places];
      const oldPlace = editedPlaces[index];
      editedPlaces[index] = new Place(oldPlace.id, title, description, oldPlace.imageUrl, oldPlace.price, oldPlace.availableFrom, oldPlace.availableTo, oldPlace.userId);
      return this.http.put(`https://placebookingapp-4a6bc.firebaseio.com/offered-places/${placeId}.json`,
      { ...editedPlaces[index], id:null });
    }),tap(() => {
      this._places.next(editedPlaces);
    }));

    // return this.places.pipe(take(1), tap(places => {
    //   const index = places.findIndex(place => place.id === placeId);
    //   const editedPlaces = [...places];
    //   const oldPlace = editedPlaces[index];
    //   editedPlaces[index] = new Place(oldPlace.id, title, description, oldPlace.imageUrl, oldPlace.price, oldPlace.availableFrom, oldPlace.availableTo, oldPlace.userId);
    // }));
  }
}
