import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MDeliverryInfor } from 'src/app/_models/deliverryinfor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryinforService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService ) { } 
  getAll(CompanyCode, CustomerId, Phone, Email, TaxCode): Observable<MDeliverryInfor[]> {
    return this.http.get<MDeliverryInfor[]>(this.baseUrl + 'DeliveryInfor/GetAll?CompanyCode=' + CompanyCode +'&CustomerId=' + CustomerId +'&Phone=' + Phone +'&Email=' + Email +'&TaxCode=' + TaxCode );
  }
   
  getItem(CompanyCode, Code): Observable<MDeliverryInfor> {
    return this.http.get<MDeliverryInfor>(this.baseUrl + 'DeliveryInfor/GetByCode?CompanyCode=' + CompanyCode +'&Code=' + Code );
  }
   
    
  create(model: MDeliverryInfor) {
   
    return this.http.post(this.baseUrl + 'DeliveryInfor/create', model );
  }

    
  update(model: MDeliverryInfor) {
    
    return this.http.put(this.baseUrl + 'DeliveryInfor/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'DeliveryInfor/delete' + Id );
  }
  // import(data: DataImport) {
  //   let store = this.authService.storeSelected();
    
  //   data.createdBy = this.authService.decodeToken?.unique_name ;
  //   data.companyCode = store.companyCode;
  //   return this.http.post(this.baseUrl + 'InvoiceInfor/import', data );
  // }

}
