import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private _isAuthenticated = false;
    private _userId = '1';

    get isAuthenticated() {
        return this._isAuthenticated;
    }

    get userId(){
        return this._userId;
    }

    constructor() { }

    login() {
        this._isAuthenticated = true;
    }

    logout() {
        this._isAuthenticated = false;
    }
}
