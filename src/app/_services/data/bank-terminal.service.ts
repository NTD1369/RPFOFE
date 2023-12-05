import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MBankTerminal } from 'src/app/_models/bank-terminal';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankTerminalService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode ): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'BankTerminal/GetAll?companyCode='+companyCode );
  }
  GetById(companyCode, id): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'BankTerminal/GetById?companyCode='+companyCode+'&id=' + id  );
  }
  //Type 1(Sales), 5(Void) 
  //BankName Tên ngân hàng
  //PortName Comp Name
  //Amount Tiền
  //InvoiceNo Sử dụng khi void 
  //timeOut 60s 
 
  ReadData(Type, BankName, PortName, amount, InvoiceNo, OrderId, timeOut): Observable<any> {
    return this.http.post(this.baseUrl + 'BankTerminal/ReadData?Type='+Type+'&BankName=' + BankName +'&PortName=' + PortName+'&InvoiceNo=' + InvoiceNo +'&amount='+amount +'&OrderId='+OrderId+'&timeOut=' + timeOut , null);
  }

  SendPayment(Type, BankName, PortName, amount, InvoiceNo,OrderId,  timeOut): Observable<any> {
    return this.http.post(this.baseUrl + 'BankTerminal/SendPayment?Type='+Type+'&BankName=' + BankName +'&PortName=' + PortName+'&InvoiceNo=' + InvoiceNo +'&amount='+amount+'&OrderId='+OrderId+'&timeOut=' + timeOut , null);
  }

  GetByCounter(companyCode, StoreId, CounterId): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'BankTerminal/GetByCounter?companyCode='+companyCode+'&StoreId=' + StoreId +'&CounterId=' + CounterId  );
  }

  create(model: MBankTerminal) {
    return this.http.post(this.baseUrl + 'BankTerminal/create', model );
  }

    
  update(model: MBankTerminal) {
    return this.http.put(this.baseUrl + 'BankTerminal/update', model);
  }
 
  
  delete(model: MBankTerminal) {
    return this.http.post(this.baseUrl + 'BankTerminal/delete', model );
  }


}
