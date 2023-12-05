import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { StorePaymentViewModel } from 'src/app/_models/viewmodel/storepayment';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentmethodService {



  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
  getAll(companyCode): Observable<MPaymentMethod[]> {
    return this.http.get<MPaymentMethod[]>(this.baseUrl + 'paymentmethod/GetAll?companyCode=' + companyCode);
  }
  getPaymentType(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'paymentmethod/GetPaymentType');
  }

  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<MPaymentMethod[]>> {
    const paginatedResult: PaginatedResult<MPaymentMethod[]> = new PaginatedResult<MPaymentMethod[]>();
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

    return this.http.get<MPaymentMethod[]>(this.baseUrl + 'paymentmethod/GetPagedList', { observe: 'response', params})
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
  // getByStorePagedList(page?, itemsPerPage?, userParams?): Observable<any> {
  //   debugger;
  //   const paginatedResult: PaginatedResult<StorePaymentViewModel[]> = new PaginatedResult<StorePaymentViewModel[]>();
  
  //   let params = new HttpParams();


  //   if (page != null && itemsPerPage != null) {
  //     params = params.append('pageNumber', page);
  //     params = params.append('pageSize', itemsPerPage);
  //   }

  //   if (userParams != null) {
  //     params = params.append('keyword', userParams.keyword);
  //     params = params.append('store', userParams.store);
  //     params = params.append('orderBy', userParams.orderBy);
  //   }

  //   return this.http.get<any>(this.baseUrl + 'paymentmethod/GetByStore', { observe: 'response', params})
  //     .pipe(
  //       map((response: any) => {
  //         debugger;
  //         if(response.status==="failed")
  //         {
              
  //         }
  //         else
  //         {
  //           paginatedResult.result = response.body;
         
  //           if (response.headers.get('Pagination') != null) {
  //             paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
  //           }
  //           return paginatedResult;
  //         }
         
  //       })
  //     );

  //   // return this.http.get<Item[]>(this.baseUrl + 'item/GetAll');
  // }
  getItem(companyCode, storeId, id): Observable<MPaymentMethod> {
    return this.http.get<MPaymentMethod>(this.baseUrl + 'paymentmethod/GetById?companyCode=' + companyCode + '&storeId='+ storeId +'&code=' + id);
  }
   
    
  create(paymentmethod: MPaymentMethod) {
    let store = this.authService.storeSelected();
   
    paymentmethod.createdBy = this.authService.decodeToken?.unique_name ;
    paymentmethod.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'paymentmethod/create', paymentmethod );
  }

    
  update(paymentmethod: MPaymentMethod) {
    let store = this.authService.storeSelected();
   
    paymentmethod.createdBy = this.authService.decodeToken?.unique_name ;
    paymentmethod.companyCode = store.companyCode;
    return this.http.put(this.baseUrl + 'paymentmethod/update', paymentmethod);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'paymentmethod/delete' + Id );
  }
  import(data: DataImport) {
    let store = this.authService.storeSelected();
    debugger;
    // warehouse.storeId = store.storeId;
    data.createdBy = this.authService.decodeToken?.unique_name ;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'paymentmethod/import', data );
  }
}
