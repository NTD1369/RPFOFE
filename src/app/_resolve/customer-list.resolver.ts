import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemService } from '../_services/data/item.service';
import { AlertifyService } from '../_services/system/alertify.service';
import { Item } from '../_models/item';
import { MCustomer } from '../_models/customer';
import { CustomerService } from '../_services/data/customer.service';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class CustomerListResolver implements Resolve<MCustomer[]> {
    pageNumber = 1;
    pageSize = 5;

    constructor(private customerService: CustomerService, private router: Router, private authSerive: AuthService,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<MCustomer[]> {
        let comp= this.authSerive.storeSelected();
        return this.customerService.getByCompany(comp.companyCode, "C").pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/shop']);
                return of(null);
            })
        );
    }
}
