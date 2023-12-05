import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MTerminalPeripherals } from 'src/app/_models/peripherals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TerminalPeripheralsService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode,  storeId,  terminalId,  isSetup ): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'TerminalPeripherals/GetAll?companyCode='+companyCode+'&storeId=' + storeId +'&terminalId=' + terminalId + '&isSetup=' + isSetup  );
  }
  GetById(companyCode,  storeId,  terminalId,  code): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'TerminalPeripherals/GetById?companyCode='+companyCode+'&storeId=' + storeId+'&terminalId=' + terminalId + '&PeripheralCode=' + code  );
  }
  //Type 1(Sales), 5(Void) 
  //BankName Tên ngân hàng
  //PortName Comp Name
  //Amount Tiền
  //InvoiceNo Sử dụng khi void 
  //timeOut 60s 
 

  create(model: MTerminalPeripherals) {
    return this.http.post(this.baseUrl + 'TerminalPeripherals/create', model );
  }

    
  update(model: MTerminalPeripherals) {
    return this.http.put(this.baseUrl + 'TerminalPeripherals/update', model);
  }
 
  
  delete(model: MTerminalPeripherals) {
    return this.http.post(this.baseUrl + 'TerminalPeripherals/delete', model );
  }
 
  apply(model: MTerminalPeripherals) {
    return this.http.post(this.baseUrl + 'TerminalPeripherals/apply', model );
  }

}
