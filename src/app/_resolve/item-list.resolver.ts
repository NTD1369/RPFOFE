import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemService } from '../_services/data/item.service';
import { AlertifyService } from '../_services/system/alertify.service';
import { Item } from '../_models/item';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class ItemListResolver implements Resolve<Item[]> {
    pageNumber = 1;
    pageSize = 500;
    userParams: any = {};
    constructor(private itemService: ItemService, private router: Router, private authService: AuthService,
                private alertify: AlertifyService) {
                    this.userParams.company = this.authService.getCurrentInfor().companyCode; 
                }

    resolve(route: ActivatedRouteSnapshot): Observable<Item[]> {
        debugger;
        // return this.itemService.getItemPagedList(this.pageNumber, this.pageSize, this.userParams ).pipe(
        //     catchError(error => {
        //         this.alertify.error('Problem retrieving data');
        //         this.router.navigate(['/admin']);
        //         return of(null);
        //     })
        // );
        return this.itemService.getItems(this.authService.getCurrentInfor().companyCode,'','','').pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
