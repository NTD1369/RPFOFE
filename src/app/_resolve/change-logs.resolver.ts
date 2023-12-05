import {Injectable} from '@angular/core'; 
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { AlertifyService } from '../_services/system/alertify.service';  
import { MStoreGroup } from '../_models/storegroup';
import { StoregroupService } from '../_services/data/storegroup.service';
import { ReleaseNoteService } from '../_services/common/release-note.service';
import { SReleaseNote } from '../_models/system/releaseNote';

@Injectable()
export class ReleaseNoteListResolver implements Resolve<SReleaseNote[]> {
    pageNumber = 1;
    pageSize = 10; 
    constructor(private releaseNoteService: ReleaseNoteService, private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any[]> {
        return this.releaseNoteService.getItemPagedList(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
