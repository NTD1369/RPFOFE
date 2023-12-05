import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TGoodsReceiptPoheader } from '../_models/grpo'; 
import { AlertifyService } from '../_services/system/alertify.service';
import { GrpoService } from '../_services/transaction/grpo.service';

@Injectable()
export class GRPODetailResolver implements Resolve<TGoodsReceiptPoheader> {
  constructor(
    private grpoService: GrpoService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<TGoodsReceiptPoheader> { 
    return this.grpoService.getBill(route.params['id'], route.params['companycode'], route.params['storeid']).pipe(
      catchError((error) => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/shop/bills']);
        return of(null);
      })
    );
  }
}
