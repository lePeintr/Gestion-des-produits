import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthentificationService } from "../services/authentification.service";
import { Observable } from "rxjs";

/* import { CanActivateFn } from '@angular/router';


export const authenticationGuard: CanActivateFn = (route, state) => {

  return true;
}; */
@Injectable({
  providedIn: 'root'
})
export class authenticationGuard implements CanActivate{
  constructor(private authService : AuthentificationService,private router: Router){
    
  }
  canActivate(route: ActivatedRouteSnapshot,
     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let authenticated = (this.authService.isAuthenticated());
    if(authenticated==false){
      this.router.navigateByUrl("/login");
      return false;
    }
    else{
      return true;
    }
  }
}