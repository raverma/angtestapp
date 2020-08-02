import { Subject } from 'rxjs';
import { AuthData } from "./auth-data.model";
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root"})
export class AuthService {
    private token: string = '';
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
        this.http.post<{message: string, token: string}>("http://localhost:3000/api/user/login", {email, password})
            .subscribe(response => {
                this.token = response.token;
                if (this.token){
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    this.router.navigate(["/"]);
                }
            });

    }

    getToken(){
        return this.token;
    }

    logout(){
        this.isAuthenticated = false;
        this.token = '';
        this.authStatusListener.next(false);
        this.router.navigate(["/"]);
    }
}