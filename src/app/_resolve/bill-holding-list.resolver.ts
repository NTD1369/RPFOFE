import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { AlertifyService } from '../_services/system/alertify.service'; 
import { TSalesHeader } from '../_models/tsaleheader';
import { BillService } from '../_services/data/bill.service';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class BillHoldingListResolver implements Resolve<TSalesHeader[]> {
    pageNumber = 1;
    pageSize = 5;
    userParams: any = {};
    
    constructor(private billService: BillService, public authService: AuthService, private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<TSalesHeader[]> { 
        this.userParams.status = "H";
        this.userParams.keyword = ''; 
        this.userParams.orderBy = 'byName';
        let companyCode = this.authService.storeSelected().companyCode;
        let store = this.authService.storeSelected().storeId;
        let viewBy = this.authService.getCurrentInfor().username;
        debugger;
        return this.billService.getByType(companyCode,store , "SALES",'','' , 'POS', '','H','','', viewBy).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/shop']);
                return of(null);
            })
        );
    }
}
