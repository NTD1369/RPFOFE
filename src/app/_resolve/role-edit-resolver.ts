import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';  
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';  
import { AlertifyService } from '../_services/system/alertify.service';
import { MRole } from '../_models/mrole';
import { RoleService } from '../_services/system/role.service';

@Injectable()
export class RoleEditResolver implements Resolve<MRole> {
    constructor(private roleService: RoleService, private router: Router,
                private alertify: AlertifyService, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<MRole> {
        return this.roleService.getById(route.params['id']).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving your data');
                this.router.navigate(['/admin/roles']);
                return of(null);
            })
        );
    }
}
