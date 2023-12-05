import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { AlertifyService } from '../_services/system/alertify.service'; 
import { MRole } from '../_models/mrole'; 
import { MPermission } from '../_models/mpermission';
import { PermissionService } from '../_services/system/permission.service';

@Injectable()
export class PermissionListResolver implements Resolve<MPermission[]> {
    pageNumber = 1;
    pageSize = 50;

    constructor(private permissionService: PermissionService, private router: Router,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<MPermission[]> {
        return this.permissionService.getItemPagedList(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
