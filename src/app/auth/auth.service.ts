import { Subject } from 'rxjs';
import { AuthData } from "./auth-data.model";
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: "root"})
export class AuthService {
    private token: string = '';
    private authStatusListener = new Subject<Boolean>();
    constructor(private http: HttpClient){

    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    createUser(fName: string, lName: string, email: string, pwd: string){
        const authData: AuthData = { firstName: fName, lastName: lName, email: email,password: pwd };
        this.http.post("http://localhost:3000/api/user/signup", authData)
            .subscribe(response => {
                console.log(response);
            });
    }

    loginUser(email: string, password: string){
        this.http.post<{message: string, token: string}>("http://localhost:3000/api/user/login", {email, password})
            .subscribe(response => {
                this.token = response.token;
                this.authStatusListener.next(true);
                
            })

    }

    getToken(){
        return this.token;
    }
}