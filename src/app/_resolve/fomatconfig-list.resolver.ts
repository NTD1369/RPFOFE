import {Injectable} from '@angular/core'; 
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { AlertifyService } from '../_services/system/alertify.service';  
import { MStoreGroup } from '../_models/storegroup';
import { StoregroupService } from '../_services/data/storegroup.service';
import { FormatconfigService } from '../_services/data/formatconfig.service';
import { SFormatConfig } from '../_models/sformatconfig';

@Injectable()
export class FormatConfigListResolver implements Resolve<SFormatConfig[]> {
    pageNumber = 1;
    pageSize = 50;

    constructor(private formatService: FormatconfigService, private router: Router,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<SFormatConfig[]> {
        return this.formatService.getItemPagedList(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
