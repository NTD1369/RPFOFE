import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';  
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';  
import { AlertifyService } from '../_services/system/alertify.service'; 
import { MStore } from '../_models/store';
import { StoreService } from '../_services/data/store.service';

@Injectable()
export class StoreEditResolver implements Resolve<MStore> {
    constructor(private storeService: StoreService, private router: Router, 
                private alertify: AlertifyService, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<MStore> {
        return this.storeService.getItem(this.authService.getCurrentInfor().companyCode , route.params['id']).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving your data');
                this.router.navigate(['/admin/roles']);
                return of(null);
            })
        );
    }
}
