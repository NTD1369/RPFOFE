import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { AlertifyService } from '../_services/system/alertify.service';  
 
import { MWarehouse } from '../_models/warehouse';
import { WarehouseService } from '../_services/data/warehouse.service';

@Injectable()
export class WarehouseListResolver implements Resolve<MWarehouse[]> {
    pageNumber = 1;
    pageSize = 50;

    constructor(private warehouseService: WarehouseService, private router: Router,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<MWarehouse[]> {
        return this.warehouseService.getItemPagedList(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
