import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { AlertifyService } from '../_services/system/alertify.service';  
import { MEmployee } from '../_models/employee';
import { EmployeeService } from '../_services/data/employee.service';

@Injectable()
export class EmployeeListResolver implements Resolve<MEmployee[]> {
    pageNumber = 1;
    pageSize = 50;

    constructor(private employeeService: EmployeeService, private router: Router,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<MEmployee[]> {
        return this.employeeService.getItemPagedList(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
