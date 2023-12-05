import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';  
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';  
import { AlertifyService } from '../_services/system/alertify.service'; 
import { PermissionService } from '../_services/system/permission.service';

@Injectable()
export class SettingRoleEditResolver implements Resolve<any[]> {
    constructor(private permissionService: PermissionService, private router: Router,
                private alertify: AlertifyService, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any[]> {
        return this.permissionService.GetPermissionByRole(route.params['id']).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving your data');
                this.router.navigate(['/admin/roles']);
                return of(null);
            })
        );
    }
}
