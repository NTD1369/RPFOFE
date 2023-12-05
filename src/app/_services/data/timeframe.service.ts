import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MTimeFrame, TimeFrameViewModel } from 'src/app/_models/timeframe';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class TimeframeService {


   // baseUrl = environment.apiUrl;
   baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
   
  getAll(companyCode): Observable<MTimeFrame[]> {
    return this.http.get<MTimeFrame[]>(this.baseUrl + 'timeFrame/GetAll?companyCode=' + companyCode);
  }
  getTimeFrame(companyCode, timeFrameId): Observable<TimeFrameViewModel[]> {
    return this.http.get<TimeFrameViewModel[]>(this.baseUrl + 'timeFrame/GetTimeFrame?companyCode='+ companyCode + '&timeFrameId=' + timeFrameId);
  }
 
  create(model: MTimeFrame) {
    
    return this.http.post(this.baseUrl + 'timeFrame/create', model );
  } 
    
  update(model: MTimeFrame) {
    
    return this.http.put(this.baseUrl + 'timeFrame/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'timeFrame/delete' + Id );
  }
  

}
