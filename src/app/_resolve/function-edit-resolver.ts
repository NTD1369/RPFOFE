import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';  
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';  
import { AlertifyService } from '../_services/system/alertify.service'; 
import { MFunction } from '../_models/mfunction';
import { FunctionService } from '../_services/system/function.service';

@Injectable()
export class FunctionEditResolver implements Resolve<MFunction> {
    constructor(private functionService: FunctionService, private router: Router,
                private alertify: AlertifyService, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<MFunction> {
        return this.functionService.getById(this.authService.getCurrentInfor().companyCode, route.params['id']).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving your data');
                this.router.navigate(['/admin/roles']);
                return of(null);
            })
        );
    }
}
