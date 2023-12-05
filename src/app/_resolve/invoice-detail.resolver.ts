import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TInvoiceHeader } from '../_models/invoice';
import { Order } from '../_models/viewmodel/order'; 
import { AlertifyService } from '../_services/system/alertify.service';
import { InvoiceService } from '../_services/transaction/invoice.service';

@Injectable()
export class InvoiceDetailResolver implements Resolve<TInvoiceHeader> {
  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<TInvoiceHeader> { 
    return this.invoiceService.getBill(route.params['id'], route.params['companycode'], route.params['storeid']).pipe(
      catchError((error) => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/shop/bills']);
        return of(null);
      })
    );
  }
}
