import { AuthData } from "./auth-data.model";
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: "root"})
export class AuthService {
    

    constructor(private http: HttpClient){

    }

    createUser(fName: string, lName: string, email: string, pwd: string){
        const authData: AuthData = { firstName: fName, lastName: lName, email: email,password: pwd };
        this.http.post("http://localhost:3000/api/user/signup", authData)
            .subscribe(response => {
                console.log(response);
            })
    }
}