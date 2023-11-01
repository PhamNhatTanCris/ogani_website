import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService  {

  isLoggedIn: boolean = false;  

  constructor(private storageService: StorageService,private router: Router) { }
  


  canActivate():boolean{
    this.isLoggedIn = this.storageService.isLoggedIn();
    if(this.isLoggedIn == false){
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
