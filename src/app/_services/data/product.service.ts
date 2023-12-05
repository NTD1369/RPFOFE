import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MProduct } from 'src/app/_models/mproduct';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


 
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  getAll(): Observable<MProduct[]> {
    return this.http.get<MProduct[]>(this.baseUrl + 'product/GetAll');
  }
  
  
  getItem(code): Observable<MProduct> {
    return this.http.get<MProduct>(this.baseUrl + 'product/GetByCode?code=' + code);
  }
   
    
  create(model: MProduct) {
    let store = this.authService.storeSelected();
    
    model.createdBy = this.authService.decodeToken?.unique_name ;
    model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'product/create', model );
  }

    
  update(model: MProduct) {
    let store = this.authService.storeSelected();
    
    model.modifiedBy = this.authService.decodeToken?.unique_name ;
    model.companyCode = store.companyCode;
    return this.http.put(this.baseUrl + 'product/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'product/delete' + Id );
  }
  import(data: DataImport) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'product/import', data );
  }


}
