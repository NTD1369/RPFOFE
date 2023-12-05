import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { EnvService } from 'src/app/env.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MItemVariant } from 'src/app/_models/itemVariant';

@Injectable({
  providedIn: 'root'
})
export class ItemVariantService {

  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService, public env: EnvService) { }

  getAll(FromDate,ToDate,  Status,  Keyword): Observable<MItemVariant[]> {
    
    return this.http.get<MItemVariant[]>(this.baseUrl + 'itemvariant/GetAll?FromDate=' + FromDate + '&ToDate=' + ToDate + '&Status=' + Status + '&Keyword=' + Keyword);
  }
  
  
  getItem(code): Observable<MItemVariant> {
    return this.http.get<MItemVariant>(this.baseUrl + 'itemvariant/GetByCode?code=' + code);
  }
   
    
  create(model: MItemVariant) {
    let store = this.authService.storeSelected();
    
    model.createdBy = this.authService.decodeToken?.unique_name ;
    // model.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'itemvariant/create', model );
  }

    
  update(model: MItemVariant) {
    // let store = this.authService.storeSelected(); 
    model.modifiedBy = this.authService.decodeToken?.unique_name ;
    // model.companyCode = store.companyCode;
    return this.http.put(this.baseUrl + 'itemvariant/update', model);
  }

  
  delete(model: MItemVariant) {
    return this.http.post(this.baseUrl + 'itemvariant/delete' , model );
  }

}
