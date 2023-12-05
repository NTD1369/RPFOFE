import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MInvoiceInfor } from 'src/app/_models/invoiceinfor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceinforService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  getAll(CompanyCode, CustomerId, Phone, Email, TaxCode): Observable<MInvoiceInfor[]> {
    return this.http.get<MInvoiceInfor[]>(this.baseUrl + 'InvoiceInfor/GetAll?CompanyCode=' + CompanyCode +'&CustomerId=' + CustomerId +'&Phone=' + Phone +'&Email=' + Email +'&TaxCode=' + TaxCode );
  }
   
  getItem(CompanyCode, Code): Observable<MInvoiceInfor> {
    return this.http.get<MInvoiceInfor>(this.baseUrl + 'InvoiceInfor/GetByCode?CompanyCode=' + CompanyCode +'&Code=' + Code );
  }
   
    
  create(model: MInvoiceInfor) {
   
    return this.http.post(this.baseUrl + 'InvoiceInfor/create', model );
  }

    
  update(model: MInvoiceInfor) {
    
    return this.http.put(this.baseUrl + 'InvoiceInfor/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'InvoiceInfor/delete' + Id );
  }
  // import(data: DataImport) {
  //   let store = this.authService.storeSelected();
    
  //   data.createdBy = this.authService.decodeToken?.unique_name ;
  //   data.companyCode = store.companyCode;
  //   return this.http.post(this.baseUrl + 'InvoiceInfor/import', data );
  // }


}
