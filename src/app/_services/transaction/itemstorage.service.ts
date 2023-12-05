import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { TItemStorage } from 'src/app/_models/itemstorage';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemstorageService {


    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode, storeiI, slocId, itemCode, uomCode): Observable<TItemStorage[]> {
    return this.http.get<TItemStorage[]>(this.baseUrl + 'itemstorage/GetAll?companyCode='+companyCode+'&storeiI='+storeiI+'&slocId='+slocId+'&itemCode='+itemCode+'&uomCode='+uomCode);
  }
  getByCode(companyCode, storeiI, slocId, itemCode, uomCode): Observable<TItemStorage[]> {
    return this.http.get<TItemStorage[]>(this.baseUrl + 'itemstorage/GetByCode?companyCode='+companyCode+'&storeiI='+storeiI+'&slocId='+slocId+'&itemCode='+itemCode+'&uomCode='+uomCode);
  }
 
  create(model: TItemStorage) { 
    return this.http.post(this.baseUrl + 'itemstorage/create', model );
  } 
    
  update(model: TItemStorage) {
    return this.http.put(this.baseUrl + 'itemstorage/update', model);
  } 
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'itemstorage/delete' + Id );
  }
  import(data: DataImport) {
    return this.http.post(this.baseUrl + 'itemstorage/import', data );
  }


}
