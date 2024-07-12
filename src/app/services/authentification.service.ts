import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import {AppUser} from "../model/user.model";
import { throwError ,of, Observable, } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  users : AppUser[]=[];
  authenticatedUser : AppUser | undefined;
  constructor() { 
    this.users.push({userId : UUID.UUID(),username : "user1",password: "1234",roles:["USER"]});
    this.users.push({userId : UUID.UUID(),username : "user2",password: "1234",roles:["USER"]});
    this.users.push({userId : UUID.UUID(),username : "admin",password: "1234",roles:["USER","ADMIN"]});
  }

  //methode pour authentifier un utilisateur
  public login(username : string, password : string): Observable<AppUser>{
    let appUser = this.users.find(u => u.username == username);
    if(!appUser) return throwError(()=>new Error("User not found!"));
    if(appUser.password != password){
      return throwError(()=>new Error("Bad credentials!"));
    }
    return of(appUser);
  } 


  public authenticateUser(appUser: AppUser): Observable<boolean>{
    this.authenticatedUser = appUser; //on garde l'utilisateur qui est authentifier 
    //on stocke les données pour que a chaque fois le user n'entre pas ses données pour s'authentifier
    localStorage.setItem("authUser",JSON.stringify({ussername:appUser.username,roles: appUser.roles, jwt:"JWT_TOKEN"}));
    //JWT_TOKEN correspond au token qui est renvoyé quand on s'authentifie coté backend
    return of(true);
  }

  //On verifie si l'utilisateur a bien le role qu'on lui donne en parametre et on retoourne un boolean
  public hasRole(role : String) : boolean{
   return  this.authenticatedUser!.roles.includes(role);
  }

  //On verifie si l'utilisateur est authentifié ou non

  public isAuthenticated(){
    return this.authenticatedUser != undefined;
  }

  public logout(): Observable<boolean>{
    this.authenticatedUser=undefined;
    localStorage.removeItem("authUser");
    return of(true);
  }
}
