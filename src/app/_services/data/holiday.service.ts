import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MHoliday } from 'src/app/_models/holiday';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {


 
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode): Observable<MHoliday[]> {
    return this.http.get<MHoliday[]>(this.baseUrl + 'holiday/GetAll?companyCode=' + companyCode);
  }
  
  getItem(companyCode, code): Observable<MHoliday> {
    return this.http.get<MHoliday>(this.baseUrl + 'holiday/GetByCode?companyCode=' + companyCode + '&code=' + code);
  }
   
    
  create(model: MHoliday) {
    
    return this.http.post(this.baseUrl + 'holiday/create', model );
  }

    
  update(model: MHoliday) {
  
    return this.http.put(this.baseUrl + 'holiday/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'holiday/delete' + Id );
  }
  import(data: DataImport) {
    
    return this.http.post(this.baseUrl + 'holiday/import', data );
  }
}

 
