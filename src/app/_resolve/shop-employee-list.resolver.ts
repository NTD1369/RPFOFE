import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { AlertifyService } from '../_services/system/alertify.service';  
import { MEmployee } from '../_models/employee';
import { EmployeeService } from '../_services/data/employee.service';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class ShopEmployeeListResolver implements Resolve<MEmployee[]> {
    pageNumber = 1;
    pageSize = 50;

    constructor(private employeeService: EmployeeService, private router: Router, private authService: AuthService,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<MEmployee[]> {
        // this.employeeService.getByStore().subscribe((response: any) => {
        //     this.employees = response;
        //   });
        return this.employeeService.getByStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving employee data');
                this.router.navigate(['/shop']);
                return of(null);
            })
        );
    }
}
