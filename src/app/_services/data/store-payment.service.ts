import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MStorePayment } from 'src/app/_models/mstorepayment';
import { PaginatedResult } from 'src/app/_models/pagination';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class StorePaymentService {


    // baseUrl = environment.apiUrl;
    baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode): Observable<MStorePayment[]> {
    return this.http.get<MStorePayment[]>(this.baseUrl + 'storepayment/GetAll?companyCode=' + companyCode);
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MStorePayment[]>> {
    const paginatedResult: PaginatedResult<MStorePayment[]> = new PaginatedResult<MStorePayment[]>();
    // debugger;
    let params = new HttpParams();


    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('keyword', userParams.keyword);
       
      params = params.append('orderBy', userParams.orderBy);
    }

    return this.http.get<MStorePayment[]>(this.baseUrl + 'storepayment/GetPagedList', { observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
          }
          return paginatedResult;
        })
      );

    // return this.http.get<Item[]>(this.baseUrl + 'item/GetAll');
  }
  getByStore(companyCode, storeCode, CounterId, IsSetup?): Observable<any> {
    if(IsSetup===null || IsSetup===undefined)
      {IsSetup = ''
      }
    return this.http.get<any>(this.baseUrl + 'storepayment/GetByStore?companyCode='+ companyCode + '&storeid=' + storeCode + '&CounterId=' + CounterId  + '&IsSetup=' + IsSetup);
  }
  getItem(companyCode, id): Observable<MStorePayment> {
    return this.http.get<MStorePayment>(this.baseUrl + 'storepayment/GetById?companyCode='+companyCode+'&id=' + id);
  }
   
    
  create(model: MStorePayment) {
    debugger;
    // if(model.isShow.toString() === "true")
    //   model.isShow = true;
    // else
    //   model.isShow = false;
    ///api/StorePayment/Create
    return this.http.post(this.baseUrl + 'StorePayment/create', model );
  }

    
  update(model: MStorePayment) {
    // if(model.isShow.toString() === "true")
    //   model.isShow = true;
    // else
    //   model.isShow = false;
    return this.http.put(this.baseUrl + 'storepayment/update', model);
  }

  
  delete(storeid: string, paymentCode: string) {
    return this.http.delete(this.baseUrl + 'storepayment/delete?storeid=' + storeid + "&paymentCode=" + paymentCode );
  }
  import(data: DataImport) {
    let store = this.authService.storeSelected();
   
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'storepayment/import', data );
  }

}
