import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';  
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { Item } from '../_models/item';
import { ItemService } from '../_services/data/item.service';
import { AlertifyService } from '../_services/system/alertify.service';

@Injectable()
export class ItemEditResolver implements Resolve<Item> {
    constructor(private itemService: ItemService, private router: Router,
                private alertify: AlertifyService, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Item> {
        let companyCode = this.authService.getCurrentInfor().companyCode;
        return this.itemService.getItemByCode(companyCode, route.params['id']).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving your data');
                this.router.navigate(['/admin/items']);
                return of(null);
            })
        );
    }
}
