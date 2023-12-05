import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MCompany } from 'src/app/_models/company';
import { UploadImageModel } from 'src/app/_models/viewmodel/uploadImage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient , public env: EnvService) { } 
  getAll(): Observable<MCompany[]> {
    return this.http.get<MCompany[]>(this.baseUrl + 'company/GetAll');
  }
   
 
  getItem(code): Observable<MCompany> {
    return this.http.get<MCompany>(this.baseUrl + 'company/GetByCode?code=' + code);
  }
  public logoUpdate(companyCode,  image): Observable<any> {
    debugger;
    var formData: any = new FormData(); 
    let model = new UploadImageModel();
    model.param = companyCode;
    // model.param2 = itemCode;
    model.image = image;
    // formData.append('uploadModel', model); 
    // formData.append('itemCode', itemCode); 
    formData.append('image', image); 
    // formData.append("param", "abc"); 
    for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }
    // return this.http.post(this.baseUrl + 'item/Create', item);
    // return this.http.put(this.baseUrl + 'item/update', item);
    let headers = new HttpHeaders(); 
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json'
      })
   };
    return this.http.post(this.baseUrl + 'company/logoupdate?companyCode='+companyCode, formData );
  }
  create(model: MCompany) {
     
    return this.http.post(this.baseUrl + 'company/create', model );
  }

    
  update(model: MCompany) {
    console.log(model,'model');
    return this.http.put(this.baseUrl + 'company/update', model);
  }

  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'uom/delete' + Id );
  }
  // import(data: DataImport) {
  //   let store = this.authService.storeSelected();
  //   debugger;
  //   // warehouse.storeId = store.storeId;
  //   data.createdBy = this.authService.decodeToken?.unique_name ;
  //   data.companyCode = store.companyCode;
  //   return this.http.post(this.baseUrl + 'uom/import', data );
  // }

}
