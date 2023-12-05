import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from '../_models/viewmodel/order';
import { BillService } from '../_services/data/bill.service';
import { AlertifyService } from '../_services/system/alertify.service';

@Injectable()
export class BillDetailResolver implements Resolve<Order> {
  constructor(
    private billService: BillService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Order> { 
    return this.billService.getBill(route.params['id'], route.params['companycode'], route.params['storeid']).pipe(
      catchError((error) => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/shop/bills']);
        return of(null);
      })
    );
  }
}
