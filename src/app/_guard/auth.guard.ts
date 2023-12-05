import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/system/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  url: string;
  constructor(private authService: AuthService, private router: Router, private activeRoute: ActivatedRoute,
    private alertify: AlertifyService) {
      this.url = this.activeRoute.snapshot.url.join('');
    }
    canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
     
    if (this.authService.loggedIn()) {
      return true;
    }
    // debugger;
    
    // if(this.url!==null && this.url!==undefined && this.url.includes('setup-new-store') === true)
    // // if(this.authService.checkUrl(this.router.url))
    // {

    //   return true;
    // }
     
    this.alertify.error('You shall not pass!!!');
    this.router.navigate(['/home']);
    return false;
  }
}
