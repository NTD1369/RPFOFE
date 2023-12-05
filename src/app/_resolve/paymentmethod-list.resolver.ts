import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { AlertifyService } from '../_services/system/alertify.service'; 
 
import { MPaymentMethod } from '../_models/paymentmethod';
import { PaymentmethodService } from '../_services/data/paymentmethod.service';

@Injectable()
export class PaymentMethodListResolver implements Resolve<MPaymentMethod[]> {
    pageNumber = 1;
    pageSize = 50;

    constructor(private paymentService: PaymentmethodService, private router: Router,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<MPaymentMethod[]> {
        return this.paymentService.getItemPagedList(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
