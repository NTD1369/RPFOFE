import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';  
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';  
import { AlertifyService } from '../_services/system/alertify.service'; 
import { MPermission } from '../_models/mpermission';
import { PermissionService } from '../_services/system/permission.service';

@Injectable()
export class PermissionEditResolver implements Resolve<MPermission> {
    constructor(private permissionService: PermissionService, private router: Router,
                private alertify: AlertifyService, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<MPermission> {
        // this.permissionService.GetPermissionByRole("")
        return this.permissionService.getById(this.authService.getCurrentInfor().companyCode, route.params['id']).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving your data');
                this.router.navigate(['/admin/roles']);
                return of(null);
            })
        );
    }
}
