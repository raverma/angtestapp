import { AuthService } from './auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";


@Injectable()
export class AuthGuard implements CanActivate {
constructor(private AuthService: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, 
                state: RouterStateSnapshot
            ): boolean | import("@angular/router").UrlTree 
                        | import("rxjs").Observable<boolean> 
                        | Promise<boolean>
    {
        const isAuth = this.AuthService.getIsAuth();
        if (!isAuth){
            this.router.navigate(["/login"]);
        }
        return isAuth;
    }

}