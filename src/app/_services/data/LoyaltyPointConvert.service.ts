import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { SLoyaltyPointConvert } from 'src/app/_models/sloyaltyPointConvert';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyPointConvertService {

  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService,private http: HttpClient, public env: EnvService) { } 
  getByStore(CompanyCode,storeId): Observable<SLoyaltyPointConvert[]> {
    return this.http.get<SLoyaltyPointConvert[]>(this.baseUrl + 'Loyalty/PointConvert?CompanyCode=' + CompanyCode+'&storeId='+storeId);
  }
  createUpdate(model: SLoyaltyPointConvert) {
    return this.http.post(this.baseUrl + 'Loyalty/CreateUpdatePointConvert',  model );
  }
}
