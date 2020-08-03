import { Subject } from 'rxjs';
import { AuthData } from "./auth-data.model";
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root"})
export class AuthService {
    private token: string = '';
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
            .subscribe();
    }

    loginUser(email: string, password: string){
        this.http.post<{message: string, token: string, expires: number}>("http://localhost:3000/api/user/login", {email, password})
            .subscribe(response => {
                this.token = response.token;
                if (this.token){
                    const expiresInDuration = response.expires * 1000;  //multiply by 1000 to convert ms to seconds
                    this.isAuthenticated = true;
                    this.setAuthTimer(expiresInDuration);
                    
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration);
                    this.saveAuthData(this.token, expirationDate );
                    this.router.navigate(["/"]);
                }
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

    logout(){
        this.isAuthenticated = false;
        this.token = '';
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(["/"]);
    }

    saveAuthData(token: string, expirationDate: Date){
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
    }

    clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
    }

    getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }
}