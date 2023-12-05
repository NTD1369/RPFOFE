import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { AlertifyService } from '../_services/system/alertify.service'; 
import { AuthService } from '../_services/auth.service';
import { TInvoiceHeader } from '../_models/invoice';
import { InvoiceService } from '../_services/transaction/invoice.service';

@Injectable()
export class CheckOutListResolver implements Resolve<TInvoiceHeader[]> {
    pageNumber = 1;
    pageSize = 5;

    constructor(private invoiceService: InvoiceService, private router: Router, public authService: AuthService,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<TInvoiceHeader[]> {
        let companyCode = this.authService.storeSelected().companyCode;
        let store = this.authService.storeSelected().storeId;
        return this.invoiceService.getByType(companyCode, store, 'CheckOut','','', '').pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/shop']);
                return of(null);
            })
        );
    }
}
