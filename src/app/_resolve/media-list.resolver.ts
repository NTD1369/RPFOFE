import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemService } from '../_services/data/item.service';
import { AlertifyService } from '../_services/system/alertify.service';
import { Item } from '../_models/item';
import { ItemViewModel } from '../_models/viewmodel/itemViewModel';
import { CommonService } from '../_services/common/common.service';
import { AuthService } from '../_services/auth.service';
import { environment } from 'src/environments/environment';
import { EnvService } from '../env.service';

@Injectable()
export class MediaResolver implements Resolve<any> {
    pageNumber = 1;
    pageSize = 50;

    constructor(private commonService: CommonService, private authService: AuthService,  public env: EnvService, private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ItemViewModel[]> {
        let store = this.authService.storeSelected();
        let  apiUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl; 
        return this.commonService.getDirectoryFiles(store.companyCode, store.storeId, apiUrl,"Media").pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
