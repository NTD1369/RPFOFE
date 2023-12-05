import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';  
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';  
import { AlertifyService } from '../_services/system/alertify.service';  
import { StorePaymentViewModel } from '../_models/viewmodel/storepayment'; 
import { StorePaymentService } from '../_services/data/store-payment.service';

@Injectable()
export class StorePaymentEditResolver implements Resolve<StorePaymentViewModel> {
    constructor(private paymentMethodService: StorePaymentService, private router: Router,
                private alertify: AlertifyService, private authService: AuthService) {}
                pageNumber = 1;
                pageSize = 50;
                userParams: any = {};
    resolve(route: ActivatedRouteSnapshot): Observable<StorePaymentViewModel> {
        
        this.userParams.store = route.params['storeid']; 
         let store = this.authService.storeSelected();
        return this.paymentMethodService.getByStore(store.companyCode, this.userParams.store,'').pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving your data');
                this.router.navigate(['/admin/roles']);
                return of(null);
            })
        );
    }
}
