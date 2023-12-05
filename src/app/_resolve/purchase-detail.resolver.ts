import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TPurchaseOrderHeader } from '../_models/purchase'; 
import { AlertifyService } from '../_services/system/alertify.service';
import { PurchaseService } from '../_services/transaction/purchase.service';

@Injectable()
export class PurchaseDetailResolver implements Resolve<TPurchaseOrderHeader> {
  constructor(
    private burchaseService: PurchaseService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<TPurchaseOrderHeader> { 
    return this.burchaseService.getBill(route.params['id'], route.params['companycode'], route.params['storeid']).pipe(
      catchError((error) => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/shop/bills']);
        return of(null);
      })
    );
  }
}
