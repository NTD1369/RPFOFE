import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { AlertifyService } from '../_services/system/alertify.service';  
import { MStore } from '../_models/store';
import { StoreService } from '../_services/data/store.service';

@Injectable()
export class StoreListResolver implements Resolve<MStore[]> {
    pageNumber = 1;
    pageSize = 150;

    constructor(private storeService: StoreService, private router: Router,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<MStore[]> {
        return this.storeService.getItemPagedList(this.pageNumber, this.pageSize).pipe(
            
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
