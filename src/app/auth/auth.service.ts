import { Subject } from 'rxjs';
import { AuthData } from "./auth-data.model";
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root"})
export class AuthService {
    private token: string = '';
    private loggedUserId: string;
    private tokenTimer;
    private isAuthenticated = false;
    private authStatusListener = new Subject<Boolean>();
    constructor(private http: HttpClient, private router: Router){

    }
    getIsAuth() {
        return this.isAuthenticated;
    }
    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    createUser(fName: string, lName: string, email: string, pwd: string){
        const authData: AuthData = { firstName: fName, lastName: lName, email: email,password: pwd };
        this.http.post("http://localhost:3000/api/user/signup", authData)
            .subscribe(response => {
                this.router.navigate(["/"]);
            }, error => {
                console.log(error);
            });
    }

    loginUser(email: string, password: string){
        this.http.post<{message: string, token: string, userId: string, expires: number}>("http://localhost:3000/api/user/login", {email, password})
            .subscribe(response => {
                this.token = response.token;
                if (this.token){
                    const expiresInDuration = response.expires * 1000;  //multiply by 1000 to convert ms to seconds
                    this.isAuthenticated = true;
                    this.loggedUserId = response.userId;
                    this.setAuthTimer(expiresInDuration);
                    
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration);
                    this.saveAuthData(this.token, this.loggedUserId, expirationDate);
                    this.router.navigate(["/"]);
                }
            }, error => {
                this.authStatusListener.next(false);
            });

    }

    autoAuthUser() {
        const authInfo = this.getAuthData();
        if (!authInfo){
            return;
        }
        const now = new Date();
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime() ;
        if (expiresIn > 0){
            this.token = authInfo.token;
            this.isAuthenticated = true;
            this.loggedUserId = authInfo.userId;
            this.setAuthTimer(expiresIn);
            this.authStatusListener.next(true);
        }
    }

    setAuthTimer(duration: number){
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration);
    }
    getToken(){
        return this.token;
    }

    getUserId(){
        return this.loggedUserId;
    }
    
    logout(){
        this.isAuthenticated = false;
        this.token = '';
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.loggedUserId = null;
        this.clearAuthData();
        this.router.navigate(["/"]);
    }

    saveAuthData(token: string, userId: string, expirationDate: Date){
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
        localStorage.setItem("loggedUserId", userId);
    }

    clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("loggedUserId");
    }

    getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("loggedUserId");
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }
}