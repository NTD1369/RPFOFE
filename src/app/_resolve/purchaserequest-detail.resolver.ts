import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {  TPurchaseRequestHeader } from '../_models/purchase'; 
import { AlertifyService } from '../_services/system/alertify.service';
import { purchaseRequestService } from '../_services/transaction/puchaserequest.service';

@Injectable()
export class PurchaseRequestDetailResolver implements Resolve<TPurchaseRequestHeader> {
  constructor(
    private burchaseService: purchaseRequestService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<TPurchaseRequestHeader> { 
    return this.burchaseService.getBill(route.params['id'], route.params['companycode'], route.params['storeid']).pipe(
      catchError((error) => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/shop/bills']);
        return of(null);
      })
    );
  }
}
