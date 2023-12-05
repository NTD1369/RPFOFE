import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { AlertifyService } from '../_services/system/alertify.service'; 
import { TSalesHeader } from '../_models/tsaleheader';
import { BillService } from '../_services/data/bill.service';
import { AuthService } from '../_services/auth.service';
import { DatePipe } from '@angular/common';

@Injectable()
 
export class BillListResolver implements Resolve<TSalesHeader[]> {
    pageNumber = 1;
    pageSize = 5;

    constructor(private billService: BillService, private router: Router, public authService: AuthService,  public datepipe: DatePipe,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<TSalesHeader[]> {
        let companyCode = this.authService.storeSelected().companyCode;
        let store = this.authService.storeSelected().storeId;
        let now = new Date();
        let from = now.setDate(now.getDate() - 0 ); 
        let viewBy = this.authService.getCurrentInfor().username;
       
        return this.billService.getByType(companyCode, store, '', this.datepipe.transform(from, 'yyyy-MM-dd'),  this.datepipe.transform(new Date(), 'yyyy-MM-dd'), 
        'POS', '','','','' , viewBy).pipe(


            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/shop']);
                return of(null);
            })
        );
    }
}
