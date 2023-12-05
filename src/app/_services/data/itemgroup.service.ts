import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MItemGroup } from 'src/app/_models/mitemgroup';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemgroupService {



  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  getAll(CompanyCode): Observable<MItemGroup[]> {
    return this.http.get<MItemGroup[]>(this.baseUrl + 'itemgroup/GetAll?CompanyCode=' + CompanyCode);
  }
  
  
  getItem(CompanyCode, code): Observable<MItemGroup> {
    return this.http.get<MItemGroup>(this.baseUrl + 'itemgroup/GetByCode?CompanyCode='+CompanyCode+'&code=' + code);
  }
   
    
  create(model: MItemGroup) {
    let store = this.authService.storeSelected();
    
    model.createdBy = this.authService.decodeToken?.unique_name ;
    model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'itemgroup/create', model );
  }

    
  update(model: MItemGroup) {
    let store = this.authService.storeSelected(); 
    model.modifiedBy = this.authService.decodeToken?.unique_name ;
    model.companyCode = store.companyCode;
    return this.http.put(this.baseUrl + 'itemgroup/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'itemgroup/delete' + Id );
  }
  import(data: DataImport) {
    let store = this.authService.storeSelected();
    
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'itemgroup/import', data );
  }


}
