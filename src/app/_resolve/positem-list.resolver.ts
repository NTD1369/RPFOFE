import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemService } from '../_services/data/item.service';
import { AlertifyService } from '../_services/system/alertify.service';
import { Item } from '../_models/item';
import { ItemViewModel } from '../_models/viewmodel/itemViewModel';

@Injectable()
export class POSItemListResolver implements Resolve<ItemViewModel[]> {
    pageNumber = 1;
    pageSize = 50;

    constructor(private itemService: ItemService, private router: Router,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ItemViewModel[]> {
        return this.itemService.GetItemWPriceList(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
