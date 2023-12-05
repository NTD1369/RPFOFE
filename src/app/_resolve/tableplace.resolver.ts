import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TPurchaseOrderHeader } from '../_models/purchase'; 
import { TablePlaceService } from '../_services/data/table-place.service';
import { AlertifyService } from '../_services/system/alertify.service';
import { PurchaseService } from '../_services/transaction/purchase.service';

@Injectable()
export class TablePlaceResolver implements Resolve<any> {
  constructor(
    private tablePlaceService: TablePlaceService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> { 
    return this.tablePlaceService.getAll('CP001', route.params['storeid'], route.params['placeid'],'', "", "Y" , "Y").pipe(
      catchError((error) => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/shop/bills']);
        return of(null);
      })
    );
  }
}
