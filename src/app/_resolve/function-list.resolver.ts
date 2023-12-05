import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { AlertifyService } from '../_services/system/alertify.service';  
import { MFunction } from '../_models/mfunction';
import { FunctionService } from '../_services/system/function.service';

@Injectable()
export class FunctionListResolver implements Resolve<MFunction[]> {
    pageNumber = 1;
    pageSize = 50;

    constructor(private functionService: FunctionService, private router: Router,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<MFunction[]> {
        return this.functionService.getItemPagedList(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
