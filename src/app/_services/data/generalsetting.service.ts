import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { GeneralSettingStore, SGeneralSetting } from 'src/app/_models/generalsetting';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralsettingService {



  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode): Observable<SGeneralSetting[]> {
    return this.http.get<SGeneralSetting[]>(this.baseUrl + 'generalsetting/GetAll?companyCode=' + companyCode);
  }
  
  // getByStore(companyCode, storeid): Observable<SGeneralSetting> {
  //   return this.http.get<SGeneralSetting>(this.baseUrl + 'generalsetting/GetByStore?companyCode='+companyCode+'&storeid=' + storeid);
  // }
  GetGeneralSettingByStore(companyCode, storeid): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'generalsetting/GetGeneralSettingByStore?companyCode='+companyCode+'&storeid=' + storeid);
  }
   
  getItem(companyCode, storeid, code): Observable<SGeneralSetting> {
    return this.http.get<SGeneralSetting>(this.baseUrl + 'generalsetting/GetByCode?companyCode='+companyCode+'&storeid=' + storeid+'&code=' + code);
  }
   
    
  create(model: SGeneralSetting) {
    
    return this.http.post(this.baseUrl + 'generalsetting/create', model );
  }

    
  update(model: SGeneralSetting) {
    
    return this.http.put(this.baseUrl + 'generalsetting/update', model);
  }

  updateGeneralSettingList(models: SGeneralSetting[]) {
    return this.http.put(this.baseUrl + 'generalsetting/UpdateList', models);
  }
  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'generalsetting/delete' + Id );
  }
  // import(data: DataImport) {
  //   let store = this.authService.storeSelected();
  //   debugger;
    
  //   data.createdBy = this.authService.decodeToken?.unique_name ;
  //   data.companyCode = store.companyCode;
  //   return this.http.post(this.baseUrl + 'generalsetting/import', data );
  // }


}
