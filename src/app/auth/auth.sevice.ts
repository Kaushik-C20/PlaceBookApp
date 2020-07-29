import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private _isAuthenticated = true;
    private _userId = '2';

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